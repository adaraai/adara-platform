.PHONY: dev api test compose-up compose-down

dev: compose-up
	$(MAKE) api

api:
	npm install --prefix apps/api
	npm start --prefix apps/api

test:
	npm test --prefix apps/api
	python -m pytest -q packages/providers

compose-up:
	docker compose up -d postgres redis

compose-down:
	docker compose down
