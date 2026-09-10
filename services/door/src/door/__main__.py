"""Run the Door: ``python -m door`` or ``adara-door``."""

from __future__ import annotations

import logging

import uvicorn

from .app import create_app
from .config import Config


def main() -> None:
    logging.basicConfig(level=logging.INFO, format='%(levelname)s %(name)s: %(message)s')
    config = Config.from_env()
    app = create_app(config)
    uvicorn.run(app, host='0.0.0.0', port=config.port, log_level='info')


if __name__ == '__main__':
    main()
