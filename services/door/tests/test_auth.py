"""Auth and config for the Door."""

from door.config import Config


def test_dev_default_accepts_dev_key(monkeypatch):
    monkeypatch.delenv('ADARA_API_KEYS', raising=False)
    monkeypatch.setenv('ADARA_DOOR_DEV', '1')
    config = Config.from_env()
    assert config.accepts('dev')
    assert not config.accepts('wrong')
    assert not config.accepts(None)


def test_explicit_keys_win(monkeypatch):
    monkeypatch.setenv('ADARA_API_KEYS', 'sk_a, sk_b')
    monkeypatch.setenv('ADARA_DOOR_DEV', '0')
    config = Config.from_env()
    assert config.accepts('sk_a')
    assert config.accepts('sk_b')
    assert not config.accepts('dev')
