"""Settings, resolved once at start-up so a misconfiguration fails before it serves traffic."""

from __future__ import annotations

import os
from dataclasses import dataclass

MODES = ('local', 'api')

DEFAULT_PORT = 8091
"""Not 8081. Expo Metro (and Expo Go) use 8081 by default; sharing it makes the phone
load this API instead of the JS bundle and fail with HTTP 404."""

DEFAULT_SESSION_TTL_SECONDS = 3600
DEFAULT_MAX_TURNS = 200
DEFAULT_MAX_AUDIO_BYTES = 25 * 1024 * 1024


@dataclass(frozen=True)
class Config:
    """Everything this service needs to run."""

    mode: str = 'local'
    """`local` runs adara-intelligence in-process; `api` calls a deployed ADARA."""

    adara_base_url: str = 'http://localhost:8080'
    adara_api_key: str = ''
    adara_timeout: float = 180.0
    """180 s default covers MMS cold-start on first transcribe/synthesize call (~60-120 s)."""

    host: str = '0.0.0.0'
    port: int = DEFAULT_PORT

    session_ttl_seconds: int = DEFAULT_SESSION_TTL_SECONDS
    max_turns_per_session: int = DEFAULT_MAX_TURNS
    max_audio_bytes: int = DEFAULT_MAX_AUDIO_BYTES

    allowed_origins: tuple[str, ...] = ('*',)
    """CORS. `*` is right for a development BFF that holds no user data and no credentials of its
    own; a deployment that gains either must narrow this to the app's origins."""

    @classmethod
    def from_env(cls, env: dict | None = None) -> Config:
        source = env if env is not None else os.environ

        mode = source.get('ADARA_MODE', 'local').strip().lower()
        if mode not in MODES:
            raise ValueError(f'ADARA_MODE must be one of {MODES}, got {mode!r}')

        origins = source.get('VOICE_AGENT_ALLOWED_ORIGINS', '*')
        config = cls(
            mode=mode,
            adara_base_url=source.get('ADARA_BASE_URL', 'http://localhost:8080'),
            adara_api_key=source.get('ADARA_API_KEY', ''),
            adara_timeout=float(source.get('ADARA_TIMEOUT', '30')),
            host=source.get('VOICE_AGENT_HOST', '0.0.0.0'),
            port=int(source.get('PORT', str(DEFAULT_PORT))),
            session_ttl_seconds=int(source.get('VOICE_AGENT_SESSION_TTL',
                                               str(DEFAULT_SESSION_TTL_SECONDS))),
            max_turns_per_session=int(source.get('VOICE_AGENT_MAX_TURNS',
                                                 str(DEFAULT_MAX_TURNS))),
            max_audio_bytes=int(source.get('VOICE_AGENT_MAX_AUDIO_BYTES',
                                           str(DEFAULT_MAX_AUDIO_BYTES))),
            allowed_origins=tuple(o.strip() for o in origins.split(',') if o.strip()),
        )
        config.validate()
        return config

    def validate(self) -> None:
        if self.mode == 'api' and not self.adara_api_key:
            raise ValueError(
                'ADARA_MODE=api needs ADARA_API_KEY. Use ADARA_MODE=local to run the '
                'intelligence layer in this process instead.'
            )
        if self.session_ttl_seconds <= 0:
            raise ValueError('VOICE_AGENT_SESSION_TTL must be positive')
        if self.max_audio_bytes <= 0:
            raise ValueError('VOICE_AGENT_MAX_AUDIO_BYTES must be positive')

    def __repr__(self) -> str:
        # The key never prints. Same rule as the SDK's Config.
        key = '***' if self.adara_api_key else '<unset>'
        return (f'Config(mode={self.mode!r}, adara_base_url={self.adara_base_url!r}, '
                f'adara_api_key={key}, port={self.port})')
