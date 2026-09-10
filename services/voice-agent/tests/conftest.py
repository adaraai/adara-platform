"""Fakes for the ADARA side, so the service's own logic is testable without the engine.

Most of what this service does is orchestration and degradation: what happens when transcription
is missing, when understanding fails, when a session expires mid-call. Those paths are hard to
provoke through the real intelligence layer and trivial to provoke through a fake, so the unit
tests use one. `test_server.py` then runs the whole thing against the real engine, so the fake
cannot quietly drift away from what it stands in for.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

# The service, the SDK and the intelligence layer live in three sibling repositories. In CI they
# are pip-installed; from a plain checkout this is what makes `pytest` work with no setup.
ROOT = Path(__file__).resolve().parents[1]
SIBLINGS = [
    ROOT / 'src',
    ROOT.parents[2] / 'adara-sdk' / 'python',
    ROOT.parents[2] / 'adara-intelligence' / 'src',
]
for candidate in SIBLINGS:
    if candidate.is_dir() and str(candidate) not in sys.path:
        sys.path.insert(0, str(candidate))

from adara import NotImplementedYet  # noqa: E402

from voice_agent.adara import Capabilities  # noqa: E402
from voice_agent.config import Config  # noqa: E402
from voice_agent.sessions import SessionStore  # noqa: E402


def meaning(**overrides) -> dict:
    """A meaning object shaped exactly as `adara_intelligence.pipeline` produces one."""
    base = {
        'source': 'text',
        'transcript': 'NEPA don take light',
        'language': 'pcm',
        'language_evidence': {'basis': 'text_only', 'agreement': None, 'candidates': [],
                              'notes': [], 'region_check': {'consistent': True, 'note': ''}},
        'concepts': ['electricity_utility'],
        'domains': [{'domain': 'energy', 'weight': 0.9, 'terms': ['NEPA']}],
        'region': {'country': 'NG', 'basis': 'locale'},
        'context': {
            'matches': [{
                'term': 'NEPA', 'concept': 'electricity_utility', 'category': 'institution',
                'gloss': 'Colloquial name for the electricity supply. It persists in speech.',
                'reading': 'Colloquial name for the electricity supply. It persists in speech.',
                'confidence': 0.94, 'ambiguous': False, 'alternatives': [], 'sensitivity': '',
                'surface_form': 'NEPA', 'start': 0, 'end': 4,
            }],
            'gaps': [], 'provisional': True,
        },
        'provisional': True,
        'stages': {'input': 'ok', 'language': 'ok', 'context': 'ok'},
        'status': 'ok',
        'errors': {},
    }
    base.update(overrides)
    return base


class FakeGateway:
    """Stands in for `AdaraGateway`, with every failure mode switchable."""

    def __init__(self, *, capabilities: Capabilities | None = None,
                 understanding: dict | None = None,
                 transcript: str | None = None,
                 transcribe_error: Exception | None = None,
                 understand_error: Exception | None = None) -> None:
        self._capabilities = capabilities or Capabilities(
            understand=True, detect_language=True, resolve_context=True,
            transcribe=transcribe_error is None and transcript is not None,
        )
        self._understanding = understanding if understanding is not None else meaning()
        self._transcript = transcript
        self._transcribe_error = transcribe_error
        self._understand_error = understand_error
        self.calls: list[tuple] = []

    def capabilities(self, *, refresh: bool = False) -> Capabilities:
        return self._capabilities

    def understand(self, text, *, locale=None, language=None) -> dict:
        self.calls.append(('understand', text, locale, language))
        if self._understand_error:
            raise self._understand_error
        return {**self._understanding, 'transcript': text}

    def transcribe(self, filename, audio, *, language=None) -> dict:
        self.calls.append(('transcribe', filename, len(audio), language))
        if self._transcribe_error:
            raise self._transcribe_error
        return {'transcript': self._transcript, 'status': 'ok'}

    def detect_language(self, text) -> dict:
        self.calls.append(('detect_language', text))
        return {'language': 'pcm', 'confidence': 0.6, 'method': 'heuristic', 'reason': ''}

    def languages(self) -> list[dict]:
        return [{'code': 'pcm', 'name': 'Nigerian Pidgin', 'endonym': 'Naijá',
                 'status': 'claimed'},
                {'code': 'zu', 'name': 'Zulu', 'endonym': 'isiZulu', 'status': 'not_claimed'}]

    def context_coverage(self) -> list[dict]:
        return [{'language': 'pcm', 'status': 'pack_unreviewed', 'entries': 19}]

    def health(self) -> dict:
        return {'status': 'ok', 'mode': 'development'}

    def synthesize(self, text, *, language=None) -> dict:
        raise NotImplementedYet('no TTS weights are installed', status_code=501,
                                code='not_implemented')


def no_transcription() -> NotImplementedYet:
    """The state of every deployment today: specified, reachable, no weights installed."""
    return NotImplementedYet('no ASR weights are installed', status_code=501,
                             code='not_implemented')


@pytest.fixture
def store() -> SessionStore:
    return SessionStore(ttl_seconds=3600, max_turns=5)


@pytest.fixture
def config() -> Config:
    return Config.from_env({'ADARA_MODE': 'local', 'PORT': '0', 'VOICE_AGENT_HOST': '127.0.0.1'})
