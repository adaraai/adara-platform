"""Environment for the Door. Keys and MMS paths — nothing else."""

from __future__ import annotations

import hmac
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Config:
    port: int
    api_keys: frozenset[str]
    door_dev: bool
    mode: str

    @classmethod
    def from_env(cls) -> Config:
        raw_keys = os.environ.get('ADARA_API_KEYS', '').strip()
        keys = frozenset(k.strip() for k in raw_keys.split(',') if k.strip())
        # Off by default: an env var that is merely *unset* (a forgotten override, a stripped
        # compose file) must never fall back to accepting the well-known "dev" bearer token.
        door_dev = os.environ.get('ADARA_DOOR_DEV', '0').strip().lower() in {
            '1', 'true', 'yes', 'on',
        }
        if not keys and door_dev:
            keys = frozenset({'dev'})
        return cls(
            port=int(os.environ.get('PORT', '8080')),
            api_keys=keys,
            door_dev=door_dev,
            mode=os.environ.get('ADARA_DOOR_MODE', 'development'),
        )

    def accepts(self, bearer: str | None) -> bool:
        if not bearer:
            return False
        # Constant-time per-key comparison: `bearer in self.api_keys` short-circuits on the first
        # differing byte of each candidate, which leaks timing information about how close a guess
        # is once real (non-"dev") keys are in play.
        return any(hmac.compare_digest(bearer, key) for key in self.api_keys)
