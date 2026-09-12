"""FastAPI app — the public Door on :8080."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Annotated

from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from pydantic import BaseModel, Field

from .auth import require_api_key
from .brain import Brain, BrainUnavailable
from .config import Config

# The OpenAPI spec lives next to the Door source so `adara-sdk` and docs stay in sync.
_OPENAPI_YAML = (
    Path(__file__).resolve().parents[4] / 'docs' / 'openapi' / 'adara-v1.yaml'
)

logger = logging.getLogger(__name__)

MAX_UPLOAD_BYTES = 25 * 1024 * 1024  # 25 MiB — short sync audio only


class UnderstandBody(BaseModel):
    text: str = Field(min_length=1)
    locale: str | None = None
    language: str | None = None


class SynthesizeBody(BaseModel):
    text: str = Field(min_length=1)
    language: str | None = None


def create_app(config: Config | None = None, brain: Brain | None = None) -> FastAPI:
    config = config or Config.from_env()
    brain = brain or Brain()

    app = FastAPI(
        title='ADARA Door',
        version='0.1.0',
        description='Hosted Hear / Understand / Speak for African languages.',
    )
    app.state.config = config
    app.state.brain = brain

    # -- developer docs -------------------------------------------------------------------
    @app.get('/v1/openapi.json', include_in_schema=False)
    def openapi_json() -> JSONResponse:
        """Serve the canonical spec as JSON (converted from YAML at request time)."""
        try:
            import yaml  # PyYAML — already a transitive dep via uvicorn config loading
            with open(_OPENAPI_YAML, encoding='utf-8') as fh:
                spec = yaml.safe_load(fh)
            return JSONResponse(spec)
        except FileNotFoundError:
            return JSONResponse(
                {'error': 'openapi spec not found', 'path': str(_OPENAPI_YAML)},
                status_code=404,
            )

    @app.get('/v1/openapi.yaml', include_in_schema=False)
    def openapi_yaml() -> FileResponse:
        """Serve the raw YAML spec — easier to read and diff than JSON."""
        if _OPENAPI_YAML.exists():
            return FileResponse(str(_OPENAPI_YAML), media_type='application/yaml')
        return JSONResponse(
            {'error': 'openapi spec not found', 'path': str(_OPENAPI_YAML)},
            status_code=404,
        )

    @app.get('/v1/docs', include_in_schema=False)
    def swagger_ui() -> HTMLResponse:
        """Swagger UI — open in a browser to explore and try every endpoint live."""
        html = """<!DOCTYPE html>
<html>
<head>
  <title>ADARA API Docs</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script>
  SwaggerUIBundle({
    url: '/v1/openapi.json',
    dom_id: '#swagger-ui',
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
    layout: 'BaseLayout',
    deepLinking: true,
    persistAuthorization: true,
  })
</script>
</body>
</html>"""
        return HTMLResponse(html)

    # -- main routes ----------------------------------------------------------------------
    @app.get('/v1/health')
    def health() -> dict:
        caps = brain.capabilities()
        return {
            'status': 'ok',
            'service': 'adara-door',
            'mode': config.mode,
            'capabilities': caps.as_dict(),
        }

    @app.get('/v1/languages')
    def languages(
        _key: Annotated[str, Depends(require_api_key)],
        capability: str | None = None,
    ) -> dict:
        return brain.languages(capability)

    @app.get('/v1/models')
    def models(_key: Annotated[str, Depends(require_api_key)]) -> dict:
        return brain.models()

    @app.post('/v1/understand')
    def understand(
        body: UnderstandBody,
        _key: Annotated[str, Depends(require_api_key)],
    ) -> dict:
        try:
            return brain.understand(body.text, locale=body.locale, language=body.language)
        except BrainUnavailable as error:
            raise _not_implemented(error.capability, error.reason) from error
        except Exception as error:  # noqa: BLE001
            logger.exception('understand failed')
            raise HTTPException(
                status_code=500,
                detail={
                    'code': 'server_error',
                    'message': str(error),
                    'type': 'server_error',
                },
            ) from error

    @app.post('/v1/language/detect')
    def detect_language(
        body: dict,
        _key: Annotated[str, Depends(require_api_key)],
    ) -> dict:
        text = body.get('text', '')
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail={
                'code': 'empty_text', 'message': 'Send a non-empty "text" field.',
                'type': 'invalid_request_error',
            })
        try:
            result = brain.understand(text)
            lang = result.get('language')
            evidence = result.get('language_evidence') or {}
            candidates = evidence.get('candidates') or []
            return {
                'language': lang,
                'confidence': (candidates[0].get('confidence') if candidates else None),
                'method': evidence.get('basis', 'text'),
                'reason': '' if lang else 'no marker evidence',
                'abstained': lang is None,
                'candidates': candidates,
                'provisional': result.get('provisional', True),
                'caveat': '',
            }
        except BrainUnavailable as error:
            raise _not_implemented(error.capability, error.reason) from error
        except Exception as error:  # noqa: BLE001
            logger.exception('detect_language failed')
            raise HTTPException(status_code=500, detail={
                'code': 'server_error', 'message': str(error), 'type': 'server_error',
            }) from error

    @app.post('/v1/context/resolve')
    def context_resolve(
        body: dict,
        _key: Annotated[str, Depends(require_api_key)],
    ) -> dict:
        text = body.get('text', '')
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail={
                'code': 'empty_text', 'message': 'Send a non-empty "text" field.',
                'type': 'invalid_request_error',
            })
        try:
            result = brain.understand(
                text, locale=body.get('locale'), language=body.get('language'),
            )
            return result.get('context') or {
                'matches': [], 'gaps': [], 'concepts': [],
                'provisional': result.get('provisional', True),
                'status': result.get('status', 'ok'),
            }
        except BrainUnavailable as error:
            raise _not_implemented(error.capability, error.reason) from error
        except Exception as error:  # noqa: BLE001
            logger.exception('context_resolve failed')
            raise HTTPException(status_code=500, detail={
                'code': 'server_error', 'message': str(error), 'type': 'server_error',
            }) from error

    # Alias kept for SDK compat
    @app.post('/v1/context/query')
    def context_query(
        body: dict,
        _key: Annotated[str, Depends(require_api_key)],
    ) -> dict:
        return context_resolve(body, _key)

    @app.get('/v1/context/coverage')
    def context_coverage(_key: Annotated[str, Depends(require_api_key)]) -> dict:
        return brain.languages('resolve_context')

    @app.post('/v1/language/entities')
    def language_entities(
        body: dict,
        _key: Annotated[str, Depends(require_api_key)],
    ) -> dict:
        text = body.get('text', '')
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail={
                'code': 'empty_text', 'message': 'Send a non-empty "text" field.',
                'type': 'invalid_request_error',
            })
        try:
            result = brain.understand(text, language=body.get('language'))
            return {
                'entities': result.get('entities') or [],
                'language': result.get('language'),
                'backend': None,
                'status': result.get('status', 'ok'),
            }
        except BrainUnavailable as error:
            raise _not_implemented(error.capability, error.reason) from error
        except Exception as error:  # noqa: BLE001
            logger.exception('language_entities failed')
            raise HTTPException(status_code=500, detail={
                'code': 'server_error', 'message': str(error), 'type': 'server_error',
            }) from error

    @app.post('/v1/speech/transcribe')
    async def transcribe(
        _key: Annotated[str, Depends(require_api_key)],
        file: Annotated[UploadFile, File()],
        language: Annotated[str | None, Form()] = None,
        diarize: Annotated[bool, Form()] = False,
    ) -> dict:
        del diarize  # accepted for contract compatibility; not wired yet
        payload = await file.read()
        if not payload:
            # Capability probe sends empty bytes — answer 501 (not available) not 400 (bad input)
            # so the voice-agent capability map correctly reports transcribe as unavailable
            # rather than treating the probe as a client error.
            raise _not_implemented('transcribe', 'Empty audio — send real audio bytes.')
        if len(payload) > MAX_UPLOAD_BYTES:
            raise HTTPException(
                status_code=413,
                detail={
                    'code': 'payload_too_large',
                    'message': (
                        f'Audio exceeds {MAX_UPLOAD_BYTES} bytes. Use async jobs when available.'
                    ),
                    'type': 'invalid_request_error',
                },
            )
        try:
            return brain.transcribe(
                payload, filename=file.filename or 'audio.wav', language=language,
            )
        except BrainUnavailable as error:
            raise _not_implemented(error.capability, error.reason) from error
        except NotImplementedError as error:
            raise _not_implemented('transcribe', str(error)) from error
        except Exception as error:  # noqa: BLE001
            logger.exception('transcribe failed')
            raise HTTPException(
                status_code=500,
                detail={
                    'code': 'server_error',
                    'message': str(error),
                    'type': 'server_error',
                },
            ) from error

    @app.post('/v1/speech/synthesize')
    def synthesize(
        body: SynthesizeBody,
        _key: Annotated[str, Depends(require_api_key)],
    ) -> dict:
        try:
            return brain.synthesize(body.text, language=body.language)
        except BrainUnavailable as error:
            raise _not_implemented(error.capability, error.reason) from error
        except NotImplementedError as error:
            raise _not_implemented('synthesize', str(error)) from error
        except Exception as error:  # noqa: BLE001
            logger.exception('synthesize failed')
            raise HTTPException(
                status_code=500,
                detail={
                    'code': 'server_error',
                    'message': str(error),
                    'type': 'server_error',
                },
            ) from error

    @app.exception_handler(HTTPException)
    async def http_error(_request: Request, exc: HTTPException) -> JSONResponse:
        detail = exc.detail
        if isinstance(detail, dict):
            body = {
                'code': detail.get('code', 'error'),
                'message': detail.get('message', str(detail)),
                'type': detail.get('type', 'api_error'),
            }
        else:
            body = {'code': 'error', 'message': str(detail), 'type': 'api_error'}
        return JSONResponse(status_code=exc.status_code, content=body)

    return app


def _not_implemented(capability: str, reason: str) -> HTTPException:
    return HTTPException(
        status_code=501,
        detail={
            'code': 'not_implemented',
            'message': f'{capability} is not available on this Door: {reason}',
            'type': 'not_implemented_error',
        },
    )


app = create_app()
