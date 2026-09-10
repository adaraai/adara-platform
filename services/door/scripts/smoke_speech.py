"""Live Door smoke: health + synthesize + transcribe (loads MMS on first call)."""

from __future__ import annotations

import base64
import json
import sys
import urllib.error
import urllib.request

BASE = 'http://127.0.0.1:8080'
AUTH = {'Authorization': 'Bearer dev'}


def get(path: str) -> dict:
    with urllib.request.urlopen(BASE + path, timeout=30) as response:
        return json.loads(response.read())


def post_json(path: str, body: dict, *, timeout: float = 600) -> dict:
    data = json.dumps(body).encode()
    headers = {**AUTH, 'Content-Type': 'application/json'}
    request = urllib.request.Request(BASE + path, data=data, headers=headers, method='POST')
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read())


def post_multipart(path: str, field_name: str, filename: str, payload: bytes,
                   *, content_type: str = 'application/octet-stream',
                   timeout: float = 600) -> dict:
    boundary = '----adara-smoke'
    parts = [
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"\r\n'
        f'Content-Type: {content_type}\r\n\r\n'.encode(),
        payload,
        f'\r\n--{boundary}--\r\n'.encode(),
    ]
    body = b''.join(parts)
    headers = {
        **AUTH,
        'Content-Type': f'multipart/form-data; boundary={boundary}',
    }
    request = urllib.request.Request(BASE + path, data=body, headers=headers, method='POST')
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read())


def main() -> None:
    health = get('/v1/health')
    caps = health.get('capabilities', health)
    print('health ok', json.dumps(caps, indent=2))
    if not caps.get('transcribe') or not caps.get('synthesize'):
        print('speech capabilities false — run adara-intelligence/scripts/speech/download_mms.py first')
        sys.exit(1)

    print('synthesize (first call may load MMS)...')
    synthesis = post_json('/v1/speech/synthesize', {'text': 'hello', 'language': 'tw'})
    audio_b64 = synthesis.get('audio') or synthesis.get('audio_base64')
    if not audio_b64:
        raise RuntimeError(f'no audio in synthesize response: {list(synthesis.keys())}')
    wav = base64.b64decode(audio_b64)
    print('synthesize ok', {'format': synthesis.get('format'), 'bytes': len(wav)})

    print('transcribe...')
    transcript = post_multipart('/v1/speech/transcribe', 'file', 'test.wav', wav,
                                content_type='audio/wav')
    print('transcribe ok', {
        'transcript': transcript.get('transcript'),
        'language': transcript.get('language'),
        'status': transcript.get('status'),
    })


if __name__ == '__main__':
    try:
        main()
    except urllib.error.HTTPError as error:
        print('HTTP', error.code, error.read().decode()[:1000])
        sys.exit(1)
