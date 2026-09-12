"""The HTTP surface, over a real socket — including the routes the mobile app already calls.

Two halves. The first drives the service with a `FakeGateway`, so route behaviour, CORS, error
shapes and the event stream are tested without the engine. The second runs the whole stack against
the real `adara-intelligence`, which is what proves the fake has not drifted and that a phone
pointed at this service gets a usable answer today.
"""

from __future__ import annotations

import json
import threading
import urllib.error
import urllib.request
import uuid

import pytest
from conftest import FakeGateway, no_transcription

from voice_agent.config import Config
from voice_agent.server import Application, serve
from voice_agent.sessions import SessionStore

# =================================================================================================
# Harness
# =================================================================================================

def _running(application: Application):
    server = serve(application)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    host, port = server.server_address[:2]
    return server, f'http://{host}:{port}'


def _call(url: str, path: str, *, method: str = 'GET', body=None, headers=None,
          raw: bytes | None = None, content_type: str = 'application/json'):
    """One request. Returns `(status, parsed_body, headers)` and never raises on a 4xx/5xx."""
    payload = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    request = urllib.request.Request(f'{url}{path}', data=payload, method=method)
    if payload is not None:
        request.add_header('content-type', content_type)
    for name, value in (headers or {}).items():
        request.add_header(name, value)
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return response.status, _parse(response.read()), dict(response.headers)
    except urllib.error.HTTPError as error:
        return error.code, _parse(error.read()), dict(error.headers or {})


def _parse(payload: bytes):
    try:
        return json.loads(payload.decode('utf-8'))
    except (ValueError, UnicodeDecodeError):
        return payload


@pytest.fixture
def service(config):
    application = Application(config, gateway=FakeGateway(), store=SessionStore(ttl_seconds=60))
    server, url = _running(application)
    try:
        yield application, url
    finally:
        server.shutdown()
        server.server_close()


# =================================================================================================
# The catalogue routes apps/mobile already calls
# =================================================================================================

def test_health_reports_capabilities_so_the_ui_can_hide_the_microphone(service):
    """Discovering that transcription is unavailable *after* someone recorded is a worse product."""
    _, url = service
    status, body, _ = _call(url, '/v1/health')

    assert status == 200
    assert body['status'] == 'ok'
    assert body['mode'] == 'development', 'apps/mobile checks this field'
    assert body['capabilities']['understand'] is True
    assert body['capabilities']['transcribe'] is False
    assert body['capabilities']['reasons']['synthesize']


def test_languages_map_down_never_up(service):
    """`claimed` means a vendor listed the language. It must never present as production-ready."""
    _, url = service
    status, body, _ = _call(url, '/v1/languages')

    assert status == 200
    by_code = {row['code']: row for row in body['data']}
    assert by_code['pcm']['status'] == 'experimental'
    assert by_code['pcm']['adara_status'] == 'claimed', 'the true value is not lost'
    assert by_code['zu']['status'] == 'planned'
    assert 'verified' not in {row['status'] for row in body['data']}


def test_detect_language_answers_in_the_shape_the_mobile_client_parses(service):
    _, url = service
    status, body, _ = _call(url, '/v1/language/detect', method='POST', body={'text': 'NEPA don go'})

    assert status == 200
    assert body['code'] == 'pcm', 'apps/mobile reads `code`'
    assert 'confidence' in body and 'abstained' in body


def test_detect_language_rejects_empty_text(service):
    _, url = service
    status, body, _ = _call(url, '/v1/language/detect', method='POST', body={'text': '  '})
    assert status == 400
    assert body['error']['code'] == 'empty_text'


def test_transcribe_explains_why_a_file_uri_cannot_work(service):
    """The mobile client posts `{audio: uri}`. A server cannot read a phone's filesystem, and
    saying so beats a 404 that looks like a routing bug."""
    _, url = service
    status, body, _ = _call(url, '/v1/speech/transcribe', method='POST', body={'audio': 'file:///x'})

    assert status == 501
    assert body['error']['code'] == 'not_implemented'
    assert 'multipart' in body['error']['message']


def test_synthesize_is_a_route_even_when_tts_is_unavailable(service):
    """The phone posts here, not to Door. A 404 looks like the API is down."""
    _, url = service
    status, body, _ = _call(url, '/v1/speech/synthesize', method='POST', body={'text': 'hello'})

    assert status == 501
    assert body['error']['code'] == 'not_implemented'


def test_generate_route_is_not_implemented(service):
    """This standalone route stays a stub; reply generation now happens per-turn instead
    (see test_llm_policy.py for OpenAIChatPolicy, which POST /v1/agent/.../turns can use)."""
    _, url = service
    status, body, _ = _call(url, '/v1/context/generate', method='POST', body={'prompt': 'hi'})

    assert status == 501
    assert 'not implemented' in body['error']['message']


# =================================================================================================
# The voice conversation
# =================================================================================================

def test_a_session_and_a_turn_round_trip(service):
    _, url = service
    status, created, _ = _call(url, '/v1/agent/sessions', method='POST', body={'locale': 'NG'})
    assert status == 201
    session_id = created['session']['id']
    assert created['capabilities']['understand'] is True

    status, turned, _ = _call(url, f'/v1/agent/sessions/{session_id}/turns',
                              method='POST', body={'text': 'NEPA don take light'})
    assert status == 201
    assert turned['turn']['status'] == 'replied'
    assert turned['turn']['reply']['source'] == 'grounded_template'
    assert turned['session']['language'] == 'pcm'

    status, fetched, _ = _call(url, f'/v1/agent/sessions/{session_id}')
    assert status == 200
    assert len(fetched['session']['turns']) == 1
    assert 'meaning' not in fetched['session']['turns'][0], 'the list carries summaries'


def test_the_full_meaning_object_is_available_per_turn(service):
    """Summaries on the list, the whole thing on demand — a phone should not pull kilobytes of
    provenance on every turn, and a developer debugging one should not be denied it."""
    _, url = service
    session_id = _call(url, '/v1/agent/sessions', method='POST', body={})[1]['session']['id']
    turn_id = _call(url, f'/v1/agent/sessions/{session_id}/turns', method='POST',
                    body={'text': 'NEPA don take light'})[1]['turn']['id']

    status, body, _ = _call(url, f'/v1/agent/sessions/{session_id}/turns/{turn_id}')

    assert status == 200
    assert body['turn']['meaning']['concepts'] == ['electricity_utility']


def test_an_audio_turn_is_accepted_as_multipart(service):
    application, url = service
    application.agent._adara = FakeGateway(transcript='NEPA don take light')
    session_id = _call(url, '/v1/agent/sessions', method='POST', body={})[1]['session']['id']

    boundary = uuid.uuid4().hex
    body = (
        f'--{boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\npcm\r\n'
        f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="call.wav"\r\n'
        f'Content-Type: audio/wav\r\n\r\n'
    ).encode() + b'RIFFfakeaudio' + f'\r\n--{boundary}--\r\n'.encode()

    status, response, _ = _call(
        url, f'/v1/agent/sessions/{session_id}/turns', method='POST', raw=body,
        content_type=f'multipart/form-data; boundary={boundary}',
    )

    assert status == 201
    assert response['turn']['input_kind'] == 'audio'
    assert response['turn']['text'] == 'NEPA don take light'
    assert response['turn']['transcript_source'] == 'asr'


def test_an_audio_turn_without_asr_is_recoverable_not_fatal(service):
    """What every deployment does today. The UI offers the keyboard instead of an error."""
    application, url = service
    application.agent._adara = FakeGateway(transcribe_error=no_transcription())
    session_id = _call(url, '/v1/agent/sessions', method='POST', body={})[1]['session']['id']

    boundary = uuid.uuid4().hex
    body = (f'--{boundary}\r\nContent-Disposition: form-data; name="file"; '
            f'filename="a.wav"\r\n\r\n').encode() + b'RIFF' + f'\r\n--{boundary}--\r\n'.encode()

    status, response, _ = _call(url, f'/v1/agent/sessions/{session_id}/turns', method='POST',
                                raw=body, content_type=f'multipart/form-data; boundary={boundary}')

    assert status == 201, 'the turn was accepted; a stage of it was unavailable'
    assert response['turn']['error']['code'] == 'transcription_unavailable'
    assert response['turn']['error']['recoverable'] is True
    assert response['turn']['reply']['text']


def test_a_missing_session_is_a_404_not_a_500(service):
    _, url = service
    status, body, _ = _call(url, '/v1/agent/sessions/sess_nope/turns', method='POST',
                            body={'text': 'hi'})
    assert status == 404
    assert body['error']['code'] == 'session_not_found'


def test_ending_a_session_removes_it(service):
    _, url = service
    session_id = _call(url, '/v1/agent/sessions', method='POST', body={})[1]['session']['id']

    assert _call(url, f'/v1/agent/sessions/{session_id}', method='DELETE')[0] == 200
    assert _call(url, f'/v1/agent/sessions/{session_id}')[0] == 404


# =================================================================================================
# Optional bearer auth (VOICE_AGENT_API_KEYS) -- off by default, matching the mobile client today
# =================================================================================================

def test_no_keys_configured_means_no_auth_is_required(service):
    """Today's default: the mobile app sends no Authorization header at all."""
    _, url = service
    assert _call(url, '/v1/agent/sessions', method='POST', body={})[0] == 201


def test_configured_keys_are_required_on_every_route_but_health():
    config = Config.from_env({
        'ADARA_MODE': 'local', 'PORT': '0', 'VOICE_AGENT_HOST': '127.0.0.1',
        'VOICE_AGENT_API_KEYS': 'sk_a, sk_b',
    })
    application = Application(config, gateway=FakeGateway(), store=SessionStore(ttl_seconds=60))
    server, url = _running(application)
    try:
        assert _call(url, '/v1/health')[0] == 200, 'health must stay open with no key'
        assert _call(url, '/v1/agent/sessions', method='POST', body={})[0] == 401
        assert _call(url, '/v1/agent/sessions', method='POST', body={},
                     headers={'authorization': 'Bearer wrong'})[0] == 401
        assert _call(url, '/v1/agent/sessions', method='POST', body={},
                     headers={'authorization': 'Bearer sk_b'})[0] == 201
    finally:
        server.shutdown()
        server.server_close()


# =================================================================================================
# Protocol details a mobile client depends on
# =================================================================================================

def test_cors_preflight_is_answered_so_expo_web_can_call_this(service):
    _, url = service
    status, _, headers = _call(url, '/v1/agent/sessions', method='OPTIONS',
                               headers={'origin': 'http://localhost:8081'})
    lowered = {k.lower(): v for k, v in headers.items()}

    assert status == 204
    assert lowered['access-control-allow-origin'] == '*'
    assert 'POST' in lowered['access-control-allow-methods']


def test_an_unknown_path_is_404_and_a_wrong_method_is_405(service):
    """A 405 tells a client the route exists and it used the wrong verb, which is a different
    bug."""
    _, url = service
    assert _call(url, '/v1/nope')[0] == 404
    assert _call(url, '/v1/health', method='POST', body={})[0] == 405


def test_errors_use_the_envelope_from_the_openapi_contract(service):
    """One client parses both this service and apps/api, so the shapes must match."""
    _, url = service
    _, body, _ = _call(url, '/v1/nope')
    assert set(body['error']) >= {'type', 'code', 'message'}


def test_the_event_stream_delivers_turn_progress(service):
    """The reason a voice UI feels responsive instead of frozen."""
    _, url = service
    session_id = _call(url, '/v1/agent/sessions', method='POST', body={})[1]['session']['id']

    events: list[str] = []
    ready = threading.Event()

    def listen():
        request = urllib.request.Request(f'{url}/v1/agent/sessions/{session_id}/events')
        with urllib.request.urlopen(request, timeout=20) as stream:
            for raw in stream:
                line = raw.decode('utf-8').strip()
                if line.startswith('event:'):
                    name = line.split(':', 1)[1].strip()
                    events.append(name)
                    if name == 'stream.open':
                        ready.set()
                    if name == 'turn.replied':
                        return

    listener = threading.Thread(target=listen, daemon=True)
    listener.start()
    assert ready.wait(timeout=10), 'the stream never opened'

    _call(url, f'/v1/agent/sessions/{session_id}/turns', method='POST', body={'text': 'NEPA'})
    listener.join(timeout=10)

    assert events[0] == 'stream.open'
    assert 'turn.created' in events and 'turn.replied' in events


def test_streaming_an_unknown_session_is_a_404_rather_than_an_open_socket(service):
    _, url = service
    status, body, _ = _call(url, '/v1/agent/sessions/sess_nope/events')
    assert status == 404
    assert body['error']['code'] == 'session_not_found'


# =================================================================================================
# The real stack
# =================================================================================================

@pytest.fixture(scope='module')
def live():
    """The service over the actual intelligence layer — no fakes anywhere in the chain."""
    pytest.importorskip('adara_intelligence',
                        reason='install adara-intelligence to run the end-to-end tests')
    application = Application(Config.from_env({
        'ADARA_MODE': 'local', 'PORT': '0', 'VOICE_AGENT_HOST': '127.0.0.1',
    }))
    server, url = _running(application)
    try:
        yield url
    finally:
        server.shutdown()
        server.server_close()


def test_a_phone_gets_real_meaning_from_a_real_engine(live):
    """Mobile UI -> this service -> adara-sdk -> adara-intelligence, with nothing stubbed."""
    session_id = _call(live, '/v1/agent/sessions', method='POST',
                       body={'locale': 'NG'})[1]['session']['id']

    status, body, _ = _call(live, f'/v1/agent/sessions/{session_id}/turns', method='POST',
                            body={'text': 'NEPA don take light, I go find POS agent'})

    turn = body['turn']
    assert status == 201
    assert turn['status'] == 'replied'
    assert 'agent_banking' in turn['meaning']['concepts']
    assert turn['meaning']['language'] == 'pcm'
    assert 'NEPA' in turn['reply']['text']
    assert turn['reply']['source'] == 'grounded_template'


def test_the_live_service_asks_about_a_word_it_does_not_know(live):
    """The contribution loop, end to end: an unresolved term becomes a question to the speaker."""
    session_id = _call(live, '/v1/agent/sessions', method='POST', body={})[1]['session']['id']

    _, body, _ = _call(live, f'/v1/agent/sessions/{session_id}/turns', method='POST',
                       body={'text': 'we reach kɔforidua yesterday'})

    reply = body['turn']['reply']
    assert reply['act'] == 'ask_unknown_term'
    assert reply['expects_answer'] is True
    assert 'kɔforidua' in reply['text']


def test_the_live_service_reports_provisional_knowledge(live):
    """Every pack shipped today is unreviewed, and a phone must be able to badge that."""
    session_id = _call(live, '/v1/agent/sessions', method='POST',
                       body={'locale': 'GH'})[1]['session']['id']

    _, body, _ = _call(live, f'/v1/agent/sessions/{session_id}/turns', method='POST',
                       body={'text': 'the momo no enter since yesterday'})

    assert body['turn']['meaning']['provisional'] is True
    assert any('native speaker' in warning for warning in body['turn']['reply']['warnings'])


def test_the_live_capability_map_is_honest_about_missing_weights(live):
    _, body, _ = _call(live, '/v1/health')
    capabilities = body['capabilities']

    assert capabilities['understand'] is True
    assert capabilities['resolve_context'] is True
    assert capabilities['transcribe'] is False
    assert 'weights' in capabilities['reasons']['transcribe'].lower() or \
           'not available' in capabilities['reasons']['transcribe'].lower()
