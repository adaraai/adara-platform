"""In-process Door smoke: health + understand (no MMS load)."""

from fastapi.testclient import TestClient

from door.app import create_app
from door.config import Config


def main() -> None:
    config = Config(port=8080, api_keys=frozenset({'dev'}), door_dev=True, mode='development')
    client = TestClient(create_app(config))

    health = client.get('/v1/health')
    assert health.status_code == 200, health.text
    body = health.json()
    assert body['service'] == 'adara-door'
    assert body['capabilities']['understand'] is True
    print('health ok', body['capabilities'])

    meaning = client.post(
        '/v1/understand',
        json={'text': 'chale the momo no enter', 'locale': 'GH'},
        headers={'Authorization': 'Bearer dev'},
    )
    assert meaning.status_code == 200, meaning.text
    data = meaning.json()
    print('understand ok', {
        'language': data.get('language'),
        'status': data.get('status'),
        'concepts': data.get('concepts'),
        'provisional': data.get('provisional'),
    })

    # Do not call transcribe/synthesize here — that loads multi-GB MMS. Route exists; 501 or
    # slow load is verified manually after download_mms.py.
    denied = client.post('/v1/understand', json={'text': 'x'})
    assert denied.status_code == 401
    print('auth ok')


if __name__ == '__main__':
    main()
