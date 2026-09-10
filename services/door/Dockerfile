# ADARA Door — public /v1 API (Python)
FROM python:3.12-slim

WORKDIR /app

# Install Door; intelligence is expected as a sibling editable install or pip package.
COPY pyproject.toml README.md ./
COPY src ./src

RUN pip install --no-cache-dir -e .

ENV PORT=8080 ADARA_DOOR_DEV=1
EXPOSE 8080
CMD ["python", "-m", "door"]
