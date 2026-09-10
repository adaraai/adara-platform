#!/usr/bin/env python
"""Generate an ADARA API key and print the environment line to add to your .env.

Usage::

    python scripts/generate_key.py              # one key, sk_live_ prefix
    python scripts/generate_key.py --test       # sk_test_ prefix — safe to commit for CI
    python scripts/generate_key.py --count 3    # three keys at once

Then set it on the Door::

    export ADARA_API_KEYS=sk_live_...
    # or append to an existing set:
    export ADARA_API_KEYS=sk_live_a,sk_live_b

Keys are 32 bytes of url-safe random data (256 bits). That is the same size as a typical
JWT secret and is overkill for a bearer token, but the cost is four extra characters and
the benefit is that brute-force is not a threat model worth discussing.

Never put keys in a browser bundle or a mobile binary. Server-side only.
"""

from __future__ import annotations

import argparse
import secrets
import sys


def make_key(*, test: bool = False) -> str:
    prefix = 'sk_test_' if test else 'sk_live_'
    return prefix + secrets.token_urlsafe(32)


def main() -> None:
    parser = argparse.ArgumentParser(description='Generate ADARA API keys.')
    parser.add_argument('--test', action='store_true',
                        help='Use sk_test_ prefix instead of sk_live_.')
    parser.add_argument('--count', type=int, default=1, metavar='N',
                        help='How many keys to generate (default: 1).')
    args = parser.parse_args()

    if args.count < 1:
        print('--count must be at least 1', file=sys.stderr)
        sys.exit(1)

    keys = [make_key(test=args.test) for _ in range(args.count)]

    print()
    for key in keys:
        print(f'  {key}')
    print()
    print('Add to the Door:')
    print(f'  export ADARA_API_KEYS={",".join(keys)}')
    print()
    print('Use in a request:')
    print(f'  curl -s http://localhost:8080/v1/health -H "Authorization: Bearer {keys[0]}"')
    print()
    print('Never put this key in a mobile app or browser bundle.')


if __name__ == '__main__':
    main()
