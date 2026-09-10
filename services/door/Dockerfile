# ADARA Door — public /v1 API (Python)
FROM python:3.12-slim

WORKDIR /app

# Install Door; intelligence is expected as a sibling editable install or pip package.
COPY pyproject.toml README.md ./
COPY src ./src

RUN pip install --no-cache-dir -e .

# Dev mode is opt-in only: a real deploy must pass ADARA_API_KEYS explicitly, not inherit a
# well-known bearer token from the image. Set ADARA_DOOR_DEV=1 yourself for local/demo use.
ENV PORT=8080

RUN useradd --system --create-home --uid 10001 door
USER door

EXPOSE 8080
CMD ["python", "-m", "door"]
