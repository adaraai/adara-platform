"""HTTP surface with a fake Brain — no MMS required."""

from fastapi.testclient import TestClient

from door.app import create_app
from door.brain import BrainUnavailable, Capabilities
from door.config import Config


class FakeBrain:
    def __init__(self) -> None:
        self._caps = Capabilities(
            understand=True,
            transcribe=False,
            synthesize=False,
            reasons={
                'transcribe': 'test: no ASR',
                'synthesize': 'test: no TTS',
            },
        )

    def capabilities(self) -> Capabilities:
        return self._caps

    def understand(self, text: str, *, locale=None, language=None) -> dict:
        return {
            'source': 'text',
            'transcript': text,
            'language': 'tw',
            'concepts': ['mobile_money'] if 'momo' in text else [],
            'status': 'ok',
            'provisional': True,
            'errors': {},
            'stages': {'input': 'ok', 'language': 'ok', 'context': 'ok'},
            'locale_echo': locale,
            'language_hint_echo': language,
        }

    def transcribe(self, audio_bytes: bytes, *, filename='audio.wav', language=None) -> dict:
        raise BrainUnavailable('transcribe', self._caps.reasons['transcribe'])

    def synthesize(self, text: str, *, language=None) -> dict:
        raise BrainUnavailable('synthesize', self._caps.reasons['synthesize'])

    def languages(self, capability=None) -> dict:
        return {'data': [], 'caveat': 'test'}

    def models(self) -> dict:
        return {'data': [], 'note': 'test'}


def _client() -> TestClient:
    config = Config(port=8080, api_keys=frozenset({'dev'}), door_dev=True, mode='development')
    return TestClient(create_app(config, FakeBrain()))


def test_health_lists_capabilities():
    response = _client().get('/v1/health')
    assert response.status_code == 200
    body = response.json()
    assert body['service'] == 'adara-door'
    assert body['capabilities']['understand'] is True
    assert body['capabilities']['transcribe'] is False


def test_understand_requires_key():
    response = _client().post('/v1/understand', json={'text': 'hello'})
    assert response.status_code == 401


def test_understand_with_key():
    response = _client().post(
        '/v1/understand',
        json={'text': 'chale the momo no enter', 'locale': 'GH'},
        headers={'Authorization': 'Bearer dev'},
    )
    assert response.status_code == 200
    body = response.json()
    assert body['language'] == 'tw'
    assert 'mobile_money' in body['concepts']


def test_transcribe_returns_501_when_unavailable():
    response = _client().post(
        '/v1/speech/transcribe',
        headers={'Authorization': 'Bearer dev'},
        files={'file': ('a.wav', b'RIFF....', 'audio/wav')},
        data={'language': 'tw'},
    )
    assert response.status_code == 501
    assert response.json()['code'] == 'not_implemented'


def test_synthesize_returns_501_when_unavailable():
    response = _client().post(
        '/v1/speech/synthesize',
        headers={'Authorization': 'Bearer dev'},
        json={'text': 'Mepa wo kyɛw', 'language': 'tw'},
    )
    assert response.status_code == 501
