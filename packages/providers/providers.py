"""Provider interfaces. ADARA must not depend on a single model vendor."""

from __future__ import annotations

from typing import Protocol, runtime_checkable


@runtime_checkable
class LLMProvider(Protocol):
    def generate(self, prompt: str, *, locale: str | None = None) -> str: ...


@runtime_checkable
class EmbeddingProvider(Protocol):
    def embed(self, texts: list[str]) -> list[list[float]]: ...


@runtime_checkable
class SpeechProvider(Protocol):
    def transcribe(self, audio_path: str, *, language: str | None = None) -> str: ...


@runtime_checkable
class TranslationProvider(Protocol):
    def translate(self, text: str, *, source: str, target: str) -> str: ...


@runtime_checkable
class RerankerProvider(Protocol):
    def rerank(self, query: str, documents: list[str]) -> list[str]: ...


@runtime_checkable
class ContextProvider(Protocol):
    def query(self, text: str, *, locale: str | None = None) -> dict: ...


class MockLLMProvider:
    """Development mock. Not a production model."""

    def generate(self, prompt: str, *, locale: str | None = None) -> str:
        return f"[mock llm locale={locale!r}] {prompt[:80]}"


class MockContextProvider:
    def query(self, text: str, *, locale: str | None = None) -> dict:
        return {"locale": locale, "matches": [], "note": "mock context; no production knowledge base"}
