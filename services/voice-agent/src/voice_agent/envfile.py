"""Load a `.env` file into the process environment, for entry points only.

Mirrors `adara_intelligence.speech.envfile` (same twenty-line reasoning: not worth a
`python-dotenv` dependency in a service whose whole point is installing anywhere). Contract is
identical too: call this from `main()` only, never from library code, and never log a value.
"""

import os
from pathlib import Path

DEFAULT_ENV_FILENAME = '.env'


def load_env_file(
    path: str | os.PathLike = DEFAULT_ENV_FILENAME, *, override: bool = False,
) -> list[str]:
    """Set environment variables from a `.env` file. Returns the NAMES set, never their values."""
    env_path = Path(path)
    try:
        raw = env_path.read_text(encoding='utf-8')
    except (OSError, UnicodeDecodeError):
        return []

    applied: list[str] = []
    for line in raw.splitlines():
        parsed = _parse_line(line)
        if parsed is None:
            continue
        name, value = parsed
        if not override and name in os.environ:
            continue
        os.environ[name] = value
        applied.append(name)
    return applied


def _parse_line(line: str) -> tuple[str, str] | None:
    stripped = line.strip()
    if not stripped or stripped.startswith('#') or '=' not in stripped:
        return None

    name, _, value = stripped.partition('=')
    name = name.strip()
    if name.startswith('export '):
        name = name[len('export '):].strip()
    if not name.replace('_', '').isalnum():
        return None

    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        return name, value[1:-1]

    value = value.split(' #', 1)[0].strip()
    return name, value
