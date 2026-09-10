"""Environment for the Door. Keys and MMS paths — nothing else."""

from __future__ import annotations

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
        door_dev = os.environ.get('ADARA_DOOR_DEV', '1').strip().lower() in {
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
        return bearer in self.api_keys
