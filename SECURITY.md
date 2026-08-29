# Security

This repository is private. Still do not commit secrets.

## Reporting

Email **security@adara.ai** (or info@adara.ai until that alias is live).

Do not open a public GitHub issue for vulnerabilities.

## We will never ask you to commit

- `.env` files, API keys, passwords
- cloud credentials or service-account JSON
- private certificates
- private datasets or model secrets

Use GitHub Actions secrets / a secret manager. Least privilege by default.

## Scanning

Enable GitHub secret scanning and Dependabot on this repository (`adara-platform`).
