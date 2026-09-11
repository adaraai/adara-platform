"""OpenAIChatPolicy — the opt-in AgentPolicy that calls a real model.

No real network calls here: `urllib.request.urlopen` is monkeypatched so the suite stays offline
and free, matching how the rest of this service is tested (see conftest.py's FakeGateway).
"""

from __future__ import annotations

import json

import pytest

from voice_agent.llm import OpenAIChatPolicy
from voice_agent.sessions import Turn


class _FakeResponse:
    def __init__(self, payload: dict) -> None:
        self._body = json.dumps(payload).encode('utf-8')

    def read(self) -> bytes:
        return self._body

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False


def _patch_openai(monkeypatch, *, reply_text: str | None = None, raises: Exception | None = None):
    captured: dict = {}

    def fake_urlopen(request, timeout=None):
        captured['body'] = json.loads(request.data.decode('utf-8'))
        captured['headers'] = dict(request.header_items())
        if raises is not None:
            raise raises
        return _FakeResponse({'choices': [{'message': {'content': reply_text}}]})

    monkeypatch.setattr('voice_agent.llm.urllib.request.urlopen', fake_urlopen)
    return captured


def _turn(role: str, *, text: str | None = None, reply_text: str | None = None) -> Turn:
    turn = Turn(id='t', role=role, created_at=0.0, text=text)
    if reply_text is not None:
        turn.reply = {'text': reply_text}
    return turn


def test_requires_an_api_key():
    with pytest.raises(ValueError):
        OpenAIChatPolicy(api_key='')


def test_empty_or_error_meaning_asks_to_repeat_without_calling_the_model(monkeypatch):
    captured = _patch_openai(monkeypatch, reply_text='should not be reached')
    policy = OpenAIChatPolicy(api_key='sk-test')

    reply = policy.reply({'status': 'error'})

    assert reply.act == 'ask_repeat'
    assert reply.expects_answer is True
    assert 'body' not in captured, 'a request with nothing to say must not call the model'


def test_a_normal_turn_is_answered_by_the_model(monkeypatch):
    captured = _patch_openai(monkeypatch, reply_text='Mobile money is a way to send cash by phone.')
    policy = OpenAIChatPolicy(api_key='sk-test', model='gpt-4o-mini', speech_available=True)

    reply = policy.reply({'transcript': 'What is momo?'})

    assert reply.source == 'openai:gpt-4o-mini'
    assert reply.act == 'acknowledge'
    assert reply.text == 'Mobile money is a way to send cash by phone.'
    assert reply.speech == {'available': True, 'reason': ''}
    assert captured['headers']['Authorization'] == 'Bearer sk-test'
    messages = captured['body']['messages']
    assert messages[-1] == {'role': 'user', 'content': 'What is momo?'}


def test_prior_turns_become_history_but_the_turn_being_answered_is_not_duplicated(monkeypatch):
    """`history` is session.turns, and the turn this call answers is already its last entry --
    duplicating it as history would show the model its own upcoming input as something already
    said."""
    captured = _patch_openai(monkeypatch, reply_text='ok')
    policy = OpenAIChatPolicy(api_key='sk-test')
    history = [
        _turn('user', text='hello'),
        _turn('agent', reply_text='hi there'),
        _turn('user', text='what is momo?'),  # the turn being answered right now
    ]

    policy.reply({'transcript': 'what is momo?'}, history=history)

    messages = captured['body']['messages']
    assert messages[0]['role'] == 'system'
    assert [(m['role'], m['content']) for m in messages[1:]] == [
        ('user', 'hello'),
        ('assistant', 'hi there'),
        ('user', 'what is momo?'),
    ]


def test_a_model_outage_degrades_to_a_reply_instead_of_failing_the_turn(monkeypatch):
    _patch_openai(monkeypatch, raises=TimeoutError('timed out'))
    policy = OpenAIChatPolicy(api_key='sk-test')

    reply = policy.reply({'transcript': 'hello'})

    assert reply.act == 'report_unavailable'
    assert reply.warnings
    assert reply.source == 'openai:gpt-4o-mini'
