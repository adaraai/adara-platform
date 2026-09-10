"""Talk to adara-intelligence. Probe lightly; load MMS only on first Hear/Speak call."""

from __future__ import annotations

import base64
import logging
import tempfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


def _jsonable(value: Any) -> Any:
    """Tuples (and nested ones) become lists so FastAPI/json.dumps stay happy."""
    if isinstance(value, dict):
        return {k: _jsonable(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [_jsonable(v) for v in value]
    return value


@dataclass
class Capabilities:
    understand: bool = False
    transcribe: bool = False
    synthesize: bool = False
    reasons: dict[str, str] = field(default_factory=dict)

    def as_dict(self) -> dict:
        return {
            'understand': self.understand,
            'transcribe': self.transcribe,
            'synthesize': self.synthesize,
            'reasons': dict(self.reasons),
        }


class Brain:
    """Lazy intelligence wiring for the Door.

    Health must stay fast: we never download or load MMS weights during probe. Speech backends are
    constructed on the first transcribe/synthesize call.
    """

    def __init__(self) -> None:
        self._text_routers = None
        self._speech_router = None
        self._speech_load_error: str | None = None
        self._capabilities: Capabilities | None = None

    def capabilities(self) -> Capabilities:
        if self._capabilities is None:
            self._capabilities = self._probe()
        return self._capabilities

    def _probe(self) -> Capabilities:
        caps = Capabilities()
        try:
            # Import routers directly — `adara_intelligence.pipeline` package __init__ pulls in
            # speech.pipeline (and possibly torch). Health must stay cheap.
            from adara_intelligence.pipeline.routers import offline_routers

            self._text_routers = offline_routers()
            caps.understand = True
        except Exception as error:  # noqa: BLE001 - probe must not crash the Door
            caps.reasons['understand'] = f'offline_routers failed: {error}'
            logger.warning('Understand unavailable: %s', error)

        speech_ok, speech_reason = self._mms_ready()
        if speech_ok:
            caps.transcribe = True
            caps.synthesize = True
        else:
            caps.reasons['transcribe'] = speech_reason
            caps.reasons['synthesize'] = speech_reason

        for name in ('understand', 'transcribe', 'synthesize'):
            if not getattr(caps, name) and name not in caps.reasons:
                caps.reasons[name] = 'unavailable in this deployment'
        return caps

    @staticmethod
    def _mms_ready() -> tuple[bool, str]:
        """True when MMS weights are already on disk.

        Never imports torch/transformers here — those imports are multi-second and must not block
        GET /v1/health. Missing packages surface on the first Hear/Speak call instead.
        """
        import os

        model = os.environ.get('ADARA_SPEECH_MMS_MODEL', 'facebook/mms-1b-all')
        if Path(model).is_dir() and any(Path(model).iterdir()):
            return True, ''

        cache_root = Path(
            os.environ.get('HF_HUB_CACHE')
            or (Path(os.environ['HF_HOME']) / 'hub' if os.environ.get('HF_HOME') else None)
            or (Path.home() / '.cache' / 'huggingface' / 'hub')
        )
        slug = 'models--' + str(model).replace('/', '--')
        snapshots = cache_root / slug / 'snapshots'
        if snapshots.is_dir() and any(snapshots.iterdir()):
            return True, ''

        return False, (
            f'MMS weights for {model!r} are not cached locally. '
            'Install adara-intelligence[mms], set HF_TOKEN if needed, then run: '
            'python scripts/speech/download_mms.py '
            '(or set ADARA_SPEECH_MMS_MODEL to a local bundle directory).'
        )
    def _ensure_speech(self) -> Any:
        if self._speech_router is not None:
            return self._speech_router
        if self._speech_load_error is not None:
            raise BrainUnavailable('speech', self._speech_load_error)
        try:
            from adara_intelligence.speech.models.adara import build_router

            logger.info('Loading MMS speech router (first Hear/Speak call)…')
            self._speech_router = build_router()
            return self._speech_router
        except Exception as error:  # noqa: BLE001
            self._speech_load_error = (
                f'Failed to load MMS weights ({error}). '
                'Check ADARA_SPEECH_MMS_MODEL / network / disk cache.'
            )
            logger.exception('MMS load failed')
            raise BrainUnavailable('speech', self._speech_load_error) from error

    def understand(self, text: str, *, locale: str | None = None,
                   language: str | None = None) -> dict:
        """Text understand without importing speech (avoids torch on the Door hot path)."""
        caps = self.capabilities()
        if not caps.understand or self._text_routers is None:
            raise BrainUnavailable('understand', caps.reasons.get('understand', 'unavailable'))

        # Do not import adara_intelligence.pipeline.intelligence — that module loads speech and
        # torch. Compose the OpenAPI Meaning shape from language + context only.
        from adara_intelligence.context.context_engine.resolve import resolve as resolve_context
        from adara_intelligence.language.pipeline.understand_text import (
            understand_text as language_understand,
        )
        from adara_intelligence.pipeline.reconcile import candidate, check_region, reconcile

        language_result = language_understand(
            text, self._text_routers.language, language_hint=language,
        )
        transcript = language_result.get('text') or text
        text_candidate = None
        if language_result.get('language') is not None or language_result.get('reason'):
            text_candidate = candidate(
                language_result.get('language'),
                'text',
                method=str(language_result.get('method') or ''),
                confidence=language_result.get('confidence'),
                reason=str(language_result.get('reason') or ''),
            )
        resolution = reconcile(language, None, text_candidate)
        context_result = None
        errors: dict[str, str] = {}
        try:
            context_obj = resolve_context(
                transcript,
                locale=locale,
                language=resolution.get('language'),
            )
            context_result = context_obj.as_dict() if hasattr(context_obj, 'as_dict') else dict(context_obj)
        except Exception as error:  # noqa: BLE001 - degrade like the full pipeline
            errors['context.resolve_context'] = str(error)
            logger.warning('context resolve failed: %s', error)

        region = (context_result or {}).get('region') or {}
        region_check = check_region(resolution.get('language'), region)
        wired = self._text_routers.describe()
        stages = {
            'input': 'ok',
            'language': language_result.get('status', 'ok'),
            'context': 'ok' if context_result is not None else (
                'error' if 'context.resolve_context' in errors else 'not_run'
            ),
        }
        backend_ran = bool(wired.get('language') or wired.get('context'))
        status = 'ok' if backend_ran and not errors else (
            'partial' if backend_ran and errors else 'interface_only'
        )
        return _jsonable({
            'source': 'text',
            'transcript': transcript,
            'language': resolution.get('language'),
            'language_evidence': {
                'basis': resolution.get('basis'),
                'agreement': resolution.get('agreement'),
                'candidates': resolution.get('candidates'),
                'notes': resolution.get('notes'),
                'region_check': region_check,
            },
            'language_support': language_result.get('language_support'),
            'language_segments': language_result.get('language_segments'),
            'code_switched': language_result.get('code_switched'),
            'normalized': None,
            'audio_quality': None,
            'diarization': None,
            'entities': language_result.get('entities'),
            'intent': language_result.get('intent'),
            'tokens': language_result.get('tokens'),
            'context': context_result,
            'concepts': (context_result or {}).get('concepts', []),
            'domains': (context_result or {}).get('domains', []),
            'region': region,
            'provisional': bool((context_result or {}).get('provisional', True)),
            'backends': wired,
            'stages': stages,
            'status': status,
            'errors': errors,
        })

    def transcribe(self, audio_bytes: bytes, *, filename: str = 'audio.wav',
                   language: str | None = None) -> dict:
        caps = self.capabilities()
        if not caps.transcribe:
            raise BrainUnavailable('transcribe', caps.reasons.get('transcribe', 'unavailable'))
        router = self._ensure_speech()
        if not router.backends_for('transcribe'):
            raise BrainUnavailable('transcribe', 'no ASR backend registered on the speech router')
        from adara_intelligence.speech.asr.transcribe import transcribe

        suffix = Path(filename).suffix or '.wav'
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as handle:
            handle.write(audio_bytes)
            path = handle.name
        try:
            transcript = transcribe(path, language=language, router=router)
        finally:
            Path(path).unlink(missing_ok=True)
        return {
            'transcript': transcript,
            'language': language,
            'language_support': None,
            'code_switched': None,
            'audio_quality': {},
            'diarization': None,
            'normalized': None,
            'status': 'ok',
            'errors': {},
        }

    def synthesize(self, text: str, *, language: str | None = None) -> dict:
        caps = self.capabilities()
        if not caps.synthesize:
            raise BrainUnavailable('synthesize', caps.reasons.get('synthesize', 'unavailable'))
        router = self._ensure_speech()
        if not router.backends_for('synthesize'):
            raise BrainUnavailable('synthesize', 'no TTS backend registered on the speech router')
        from adara_intelligence.speech.tts.synthesize import synthesize_speech

        wav = synthesize_speech(text, language=language, router=router)
        return {
            'audio_base64': base64.b64encode(wav).decode('ascii'),
            'content_type': 'audio/wav',
            'language': language,
            'status': 'ok',
            'errors': {},
        }

    def languages(self, capability: str | None = None) -> dict:
        from adara_intelligence.registry import AFRICAN_LANGUAGES

        capability = capability or 'resolve_context'
        supported: set[str] = set()
        caps = self.capabilities()
        if capability == 'resolve_context' and caps.understand and self._text_routers is not None:
            router = getattr(self._text_routers, 'context', None)
            supported |= self._codes_from(router, 'resolve_context')
        if capability == 'detect_language' and caps.understand and self._text_routers is not None:
            router = getattr(self._text_routers, 'language', None)
            supported |= self._codes_from(router, 'detect_language')
        if capability in ('transcribe', 'synthesize') and self._speech_router is not None:
            supported |= self._codes_from(self._speech_router, capability)

        return {
            'data': [
                {
                    'code': language.code,
                    'name': language.name,
                    'endonym': language.endonym,
                    'capability': capability,
                    'status': 'claimed' if language.code in supported else 'not_claimed',
                }
                for language in AFRICAN_LANGUAGES
            ],
            'caveat': (
                "'claimed' means a backend lists the language; nothing here is verified yet."
            ),
        }

    def models(self) -> dict:
        data: list[dict] = []
        caps = self.capabilities()
        if caps.understand and self._text_routers is not None:
            wired = self._text_routers.describe()
            for subsystem, capabilities in wired.items():
                for capability, names in capabilities.items():
                    for name in names:
                        data.append({
                            'name': name,
                            'capabilities': [capability],
                            'languages': None,
                            'subsystem': subsystem,
                        })
        if self._speech_router is not None:
            for capability in ('transcribe', 'synthesize'):
                for backend in self._speech_router.backends_for(capability):
                    data.append({
                        'name': getattr(backend, 'name', type(backend).__name__),
                        'capabilities': [capability],
                        'languages': None,
                    })
        note = 'Backends registered in this Door process.'
        if caps.transcribe and self._speech_router is None:
            note += ' Speech weights load on first Hear/Speak request.'
        elif not caps.transcribe:
            note += ' Speech ASR is not available.'
        return {'data': data, 'note': note}

    @staticmethod
    def _codes_from(router: Any, capability: str) -> set[str]:
        if router is None:
            return set()
        supported: set[str] = set()
        for backend in router.backends_for(capability):
            try:
                codes = backend.supported_languages()
            except Exception:  # noqa: BLE001
                continue
            if codes:
                supported.update(codes)
        return supported


class BrainUnavailable(Exception):
    def __init__(self, capability: str, reason: str) -> None:
        self.capability = capability
        self.reason = reason
        super().__init__(reason)
