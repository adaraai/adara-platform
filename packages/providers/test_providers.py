from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from providers import MockLLMProvider


def test_mock_llm_satisfies_protocol():
    provider = MockLLMProvider()
    assert "mock" in provider.generate("hello", locale="tw-GH")
