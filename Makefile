.PHONY: dev api api-stub test door-test voice-agent-test compose-up compose-down

dev: compose-up
	$(MAKE) api

# Public Door (Phase 1): Hear / Understand / Speak on :8080
# Door lives in the adara-intelligence repo (api/), checked out as a sibling of this repo.
api:
	pip install -e ../adara-intelligence
	pip install -e ../adara-intelligence/api
	python -m door

# Legacy Node stub (GET-only / POST 501) — kept for comparison
api-stub:
	npm install --prefix apps/api
	npm start --prefix apps/api

test:
	npm test --prefix apps/api
	python -m pytest -q packages/providers
	python -m pytest -q ../adara-intelligence/api/tests
	python -m pytest -q services/voice-agent/tests

door-test:
	python -m pytest -q ../adara-intelligence/api/tests

voice-agent-test:
	python -m pytest -q services/voice-agent/tests

compose-up:
	docker compose up -d postgres redis

compose-down:
	docker compose down
