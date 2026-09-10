"""Conversation state: sessions, turns, and the listeners watching them.

A voice agent is not a sequence of independent requests. What the speaker said two turns ago
decides what "it" refers to now, and the locale established at the start of a call should not have
to be re-sent on every utterance. So the unit here is a **session** that holds a locale, a settled
language, and an ordered list of turns.

Three decisions worth stating.

**Bounded, always.** Sessions expire, turns per session are capped, and a sweep runs on every
write. A voice backend that keeps every session forever is a memory leak with a product attached —
and the ones that leak are the abandoned calls, which are exactly the ones nobody notices.

**The language is remembered, not re-detected.** Text language identification abstains on short
utterances, and voice turns are short. Once a session has settled on a language — because a
detector was confident, or because the client asserted one — later turns inherit it rather than
flapping between a label and `None` every time somebody says "yes". `language_source` records
which of those happened, so a caller can tell an inherited label from a fresh detection.

**In memory, and honest about it.** This is a single-process store. Restarting drops every
in-flight conversation, and two replicas do not share state. That is a real constraint, not a
detail: it is fine for development and for a single-instance deployment, and it is the first thing
to replace with Redis (already in `docker-compose.yml`) before running more than one instance.
"""

from __future__ import annotations

import threading
import time
import uuid
from collections import deque
from dataclasses import dataclass, field


def _now() -> float:
    return time.time()


def _new_id(prefix: str) -> str:
    return f'{prefix}_{uuid.uuid4().hex[:20]}'


@dataclass
class Turn:
    """One exchange: what the speaker said, what ADARA understood, what the agent replied."""

    id: str
    role: str
    """`user` or `agent`. Turns are stored as a flat list so the transcript reads in order."""

    created_at: float
    status: str = 'pending'
    """`pending`, `understood`, `replied`, or `failed`. The mobile UI drives its state from this."""

    input_kind: str = 'text'
    """`text` or `audio`."""

    text: str | None = None
    """What the speaker said. `None` for an audio turn whose transcription is unavailable."""

    transcript_source: str = ''
    """`typed`, `asr`, or `` when there is no text at all."""

    meaning: dict | None = None
    """The full ADARA meaning object, kept so a client can inspect anything the summary omits."""

    reply: dict | None = None
    error: dict | None = None

    def as_dict(self) -> dict:
        return {
            'id': self.id,
            'role': self.role,
            'created_at': self.created_at,
            'status': self.status,
            'input_kind': self.input_kind,
            'text': self.text,
            'transcript_source': self.transcript_source,
            'meaning': self.meaning,
            'reply': self.reply,
            'error': self.error,
        }

    def summary(self) -> dict:
        """The small shape a phone should render.

        A meaning object is several kilobytes of provenance, alternatives and reasons. That is the
        right payload for a developer inspecting a result and the wrong one to push down a mobile
        connection on every turn, so the full object stays available at `GET /turns/{id}` and this
        is what the turn list returns.
        """
        reply = self.reply or {}
        meaning = self.meaning or {}
        return {
            'id': self.id,
            'role': self.role,
            'created_at': self.created_at,
            'status': self.status,
            'input_kind': self.input_kind,
            'text': self.text,
            'reply_text': reply.get('text'),
            'concepts': meaning.get('concepts', []),
            'language': meaning.get('language'),
            'provisional': bool(meaning.get('provisional')),
            'warnings': reply.get('warnings', []),
            'error': self.error,
        }


@dataclass
class Session:
    """One conversation."""

    id: str
    created_at: float
    updated_at: float
    locale: str | None = None
    language: str | None = None
    language_source: str = ''
    """`client`, `detected`, or `inherited` — see the module docstring."""

    client: dict = field(default_factory=dict)
    turns: list[Turn] = field(default_factory=list)

    def as_dict(self, *, full: bool = False) -> dict:
        return {
            'id': self.id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'locale': self.locale,
            'language': self.language,
            'language_source': self.language_source,
            'client': self.client,
            'turns': [turn.as_dict() if full else turn.summary() for turn in self.turns],
        }

    def settle_language(self, detected: str | None, *, source: str) -> None:
        """Remember a language once it is known; never unset it on a later abstention.

        A detector abstaining on "yes" is not evidence that the caller changed language, and
        letting it clear the session's label would send the next turn's context lookup to every
        pack instead of the right one.
        """
        if detected and detected != self.language:
            self.language = detected
            self.language_source = source


class SessionStore:
    """Thread-safe, bounded, in-memory sessions.

    Locked rather than lock-free because a voice turn is milliseconds of work around a call that
    takes far longer, so contention is irrelevant and correctness is not.
    """

    def __init__(self, *, ttl_seconds: int = 3600, max_turns: int = 200,
                 max_sessions: int = 10_000, clock=_now) -> None:
        self._ttl = ttl_seconds
        self._max_turns = max_turns
        self._max_sessions = max_sessions
        self._clock = clock
        self._lock = threading.RLock()
        self._sessions: dict[str, Session] = {}
        self._order: deque[str] = deque()
        self._listeners: dict[str, list] = {}

    # -- sessions ---------------------------------------------------------------------------------
    def create(self, *, locale: str | None = None, language: str | None = None,
               client: dict | None = None) -> Session:
        from .locale import apply_session_defaults

        locale, language, client = apply_session_defaults(locale, language, client)
        with self._lock:
            self._sweep()
            now = self._clock()
            session = Session(
                id=_new_id('sess'), created_at=now, updated_at=now,
                locale=locale, language=language,
                language_source='client' if language else 'locale_default',
                client=dict(client or {}),
            )
            self._sessions[session.id] = session
            self._order.append(session.id)
            self._evict_oldest_if_needed()
            return session

    def get(self, session_id: str) -> Session | None:
        with self._lock:
            self._sweep()
            return self._sessions.get(session_id)

    def delete(self, session_id: str) -> bool:
        with self._lock:
            existed = self._sessions.pop(session_id, None) is not None
            for listener in self._listeners.pop(session_id, []):
                listener(None)  # None closes the stream
            return existed

    def touch(self, session: Session) -> None:
        with self._lock:
            session.updated_at = self._clock()

    # -- turns ------------------------------------------------------------------------------------
    def add_turn(self, session: Session, *, role: str, input_kind: str = 'text',
                 text: str | None = None, transcript_source: str = '') -> Turn:
        with self._lock:
            turn = Turn(id=_new_id('turn'), role=role, created_at=self._clock(),
                        input_kind=input_kind, text=text, transcript_source=transcript_source)
            session.turns.append(turn)
            # Oldest turns fall off rather than the session failing. A long call should degrade
            # into a shorter memory, not into an error at turn 201.
            while len(session.turns) > self._max_turns:
                session.turns.pop(0)
            session.updated_at = self._clock()
            return turn

    def publish(self, session_id: str, event: dict) -> None:
        """Push an event to everything streaming this session."""
        with self._lock:
            listeners = list(self._listeners.get(session_id, []))
        for listener in listeners:
            try:
                listener(event)
            except Exception:  # noqa: BLE001 - a dead listener must not break a turn
                self.unsubscribe(session_id, listener)

    def subscribe(self, session_id: str, listener) -> None:
        with self._lock:
            self._listeners.setdefault(session_id, []).append(listener)

    def unsubscribe(self, session_id: str, listener) -> None:
        with self._lock:
            listeners = self._listeners.get(session_id, [])
            if listener in listeners:
                listeners.remove(listener)
            if not listeners:
                self._listeners.pop(session_id, None)

    def listener_count(self, session_id: str) -> int:
        with self._lock:
            return len(self._listeners.get(session_id, []))

    # -- housekeeping -----------------------------------------------------------------------------
    def _sweep(self) -> None:
        """Drop expired sessions. Called on every write, so there is no background thread to
        leak."""
        cutoff = self._clock() - self._ttl
        expired = [sid for sid, session in self._sessions.items() if session.updated_at < cutoff]
        for session_id in expired:
            self._sessions.pop(session_id, None)
            for listener in self._listeners.pop(session_id, []):
                listener(None)

    def _evict_oldest_if_needed(self) -> None:
        while len(self._sessions) > self._max_sessions:
            oldest = self._order.popleft()
            self._sessions.pop(oldest, None)
            self._listeners.pop(oldest, None)

    def __len__(self) -> int:
        with self._lock:
            return len(self._sessions)
