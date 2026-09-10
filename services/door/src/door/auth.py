"""Bearer API key checks. Keys never go in mobile or browser clients."""

from __future__ import annotations

from fastapi import Header, HTTPException, Request

from .config import Config


def _bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(' ')
    if scheme.lower() != 'bearer' or not token.strip():
        return None
    return token.strip()


def require_api_key(
    request: Request,
    authorization: str | None = Header(default=None),
) -> str:
    config: Config = request.app.state.config
    token = _bearer_token(authorization)
    if not config.accepts(token):
        raise HTTPException(
            status_code=401,
            detail={
                'code': 'unauthorized',
                'message': (
                    'Missing or invalid API key. Send Authorization: Bearer <key>. '
                    'Set ADARA_API_KEYS (comma-separated) or ADARA_DOOR_DEV=1 with key "dev".'
                ),
                'type': 'authentication_error',
            },
        )
    assert token is not None
    return token
