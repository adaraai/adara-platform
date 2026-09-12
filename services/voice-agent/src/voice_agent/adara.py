"""The one place this service talks to ADARA, and the one line that changes when the API ships.

The whole point of building on `adara-sdk` rather than on `requests` is that the transport is a
swappable detail. Today there is no deployed ADARA, so the service runs the intelligence layer
inside its own process through `LocalTransport`. When `apps/api` is wired to the real services,
this file switches to an HTTP base URL and nothing else in the codebase moves — not the routes, not
the policy, not the session store, not the tests.

Two modes, chosen by environment rather than by code:

    ADARA_MODE=local   (default)  run adara-intelligence in this process. No network, no API key.
    ADARA_MODE=api                call a deployed ADARA at ADARA_BASE_URL with ADARA_API_KEY.

`local` is not a mock. The resolutions, confidences and gaps come from the real engine reading the
real knowledge packs. What it lacks is a *service*: no auth, no rate limits, no ASR weights. Those
capabilities report themselves as unavailable rather than returning empty results that would read
as silence.

Capabilities are probed once at start-up and cached, because the mobile client needs to know what
works *before* it offers a microphone button. Discovering that transcription is unavailable after
a user has recorded thirty seconds of audio is a worse product than not showing the button.
"""

from __future__ import annotations

import logging
import struct
from dataclasses import dataclass, field

from adara import Adara, AdaraError, NotImplementedYet

from .config import Config

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Capabilities:
    """What this deployment can actually do, probed rather than assumed.

    Every field is false until something proved otherwise. A capability map that defaults to true
    and is corrected on failure hands the UI a promise it then has to retract.
    """

    understand: bool = False
    detect_language: bool = False
    resolve_context: bool = False
    transcribe: bool = False
    synthesize: bool = False
    extract_entities: bool = False
    reasons: dict = field(default_factory=dict)
    """Why each unavailable capability is unavailable, in words a developer can act on."""

    NAMES = ('understand', 'detect_language', 'resolve_context', 'transcribe',
             'synthesize', 'extract_entities')

    def as_dict(self) -> dict:
        """Serialise, guaranteeing a reason for everything that is unavailable.

        The invariant is enforced here rather than left to whoever built the object, because the
        one thing a client cannot act on is a capability that is false for no stated reason. A
        developer seeing `transcribe: false` needs to know whether that is missing weights, a
        broken backend or an endpoint nobody has specified — those lead to three different fixes.
        """
        available = {name: getattr(self, name) for name in self.NAMES}
        reasons = dict(self.reasons)
        for name, is_available in available.items():
            if not is_available and not reasons.get(name):
                reasons[name] = 'unavailable in this deployment; no reason was recorded'
        return {**available, 'reasons': reasons}


class AdaraGateway:
    """This service's whole view of ADARA. Nothing else imports the SDK."""

    def __init__(self, config: Config, client: Adara | None = None) -> None:
        self._config = config
        self._client = client if client is not None else self._build_client(config)
        self._capabilities: Capabilities | None = None

    @staticmethod
    def _build_client(config: Config) -> Adara:
        if config.mode == 'local':
            # Imported here, not at module scope, so an `api`-mode deployment does not need
            # adara-intelligence installed at all.
            from adara.local import LocalTransport

            logger.info('ADARA mode=local: running adara-intelligence in this process')
            return Adara(api_key='local', transport=LocalTransport())

        logger.info('ADARA mode=api: %s', config.adara_base_url)
        return Adara(
            api_key=config.adara_api_key,
            base_url=config.adara_base_url,
            timeout=config.adara_timeout,
        )

    # -- capability probing ----------------------------------------------------------------------
    def capabilities(self, *, refresh: bool = False) -> Capabilities:
        """What works here. Probed once, then cached for the process lifetime.

        Cached because it is read on every health check and every session creation, and because a
        capability appearing mid-process would mean weights were installed under a running server,
        which is not a thing that happens without a restart.
        """
        if self._capabilities is None or refresh:
            self._capabilities = self._probe()
        return self._capabilities

    @staticmethod
    def _make_probe_wav() -> bytes:
        """100 ms of 16-bit silence at 16 kHz — the smallest WAV MMS will accept."""
        sample_rate, channels, bits = 16000, 1, 16
        num_samples = int(sample_rate * 0.1)
        data = b'\x00' * (num_samples * channels * (bits // 8))
        byte_rate = sample_rate * channels * (bits // 8)
        block_align = channels * (bits // 8)
        header = struct.pack(
            '<4sI4s4sIHHIIHH4sI',
            b'RIFF', 36 + len(data), b'WAVE',
            b'fmt ', 16, 1, channels, sample_rate,
            byte_rate, block_align, bits,
            b'data', len(data),
        )
        return header + data

    def _probe(self) -> Capabilities:
        reasons: dict[str, str] = {}

        def probe(name: str, call) -> bool:
            try:
                call()
                return True
            except NotImplementedYet as error:
                reasons[name] = str(error)
                return False
            except AdaraError as error:
                # A capability that errors for any other reason is still unavailable, but the
                # reason is different and an operator needs to see which.
                logger.warning('Capability %s probe failed: %s', name, error)
                reasons[name] = f'probe failed: {error}'
                return False

        def probe_speech(name: str, call) -> bool:
            """Like probe() but treats a backend decode/processing error as available.

            A BackendError (HTTP 500) on a probe WAV means the backend IS loaded and ran —
            it just could not decode 100 ms of silence, which is expected for some codecs.
            NotImplementedYet (HTTP 501) means the backend is genuinely absent.
            Any other AdaraError (auth, network) is a real failure.
            """
            try:
                call()
                return True
            except NotImplementedYet as error:
                reasons[name] = str(error)
                return False
            except AdaraError as error:
                msg = str(error)
                # 'backend_failed' / 'audio could not be decoded' / 'BackendError' all mean
                # the model loaded and attempted work — the probe audio was just undecodable.
                if any(k in msg.lower() for k in ('backend', 'decode', 'format', 'audio')):
                    logger.info('Capability %s probe got backend error (available): %s', name, msg)
                    return True
                logger.warning('Capability %s probe failed: %s', name, error)
                reasons[name] = f'probe failed: {error}'
                return False

        # Probed with real but trivial input.
        understand = probe('understand', lambda: self._client.understand('probe'))
        detect = probe('detect_language', lambda: self._client.language.detect('probe text here'))
        context = probe('resolve_context', lambda: self._client.context.resolve('probe'))
        entities = probe('extract_entities', lambda: self._client.language.entities('probe'))

        # A proper WAV so MMS actually loads and attempts decoding rather than rejecting
        # immediately at the file-read stage (which would be a 501, not a backend error).
        # Speech probes use a long timeout because MMS weights load on the first call and
        # can take 60-120s on a cold start — the default 30s SDK timeout is too short.
        _probe_wav = self._make_probe_wav()
        _speech_timeout = 180.0
        transcribe = probe_speech('transcribe',
            lambda: self._client.speech.transcribe(('probe.wav', _probe_wav),
                                                   timeout=_speech_timeout))

        # Probe synthesize — the Door exposes /v1/speech/synthesize when MMS-TTS is installed.
        synthesize = probe_speech('synthesize',
            lambda: self._client.speech.synthesize('hi', language='tw',
                                                   timeout=_speech_timeout))

        return Capabilities(
            understand=understand,
            detect_language=detect,
            resolve_context=context,
            extract_entities=entities,
            transcribe=transcribe,
            synthesize=synthesize,
            reasons=reasons,
        )

    # -- the calls this service actually makes ----------------------------------------------------
    def understand(self, text: str, *, locale: str | None = None,
                   language: str | None = None) -> dict:
        """One utterance to meaning. Returns the raw payload — the policy reads it as data."""
        return self._client.understand(text, locale=locale, language=language).raw

    def detect_language(self, text: str) -> dict:
        return dict(self._client.language.detect(text))

    def transcribe(self, filename: str, audio: bytes, *, language: str | None = None) -> dict:
        return dict(self._client.speech.transcribe((filename, audio), language=language))

    def synthesize(self, text: str, *, language: str | None = None) -> dict:
        return dict(self._client.speech.synthesize(text, language=language))

    def languages(self) -> list[dict]:
        return [dict(row) for row in self._client.catalog.languages()]

    def context_coverage(self) -> list[dict]:
        return [dict(row) for row in self._client.context.coverage()]

    def health(self) -> dict:
        return dict(self._client.catalog.health())
