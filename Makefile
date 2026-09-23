COMPOSE_DEV  := docker compose
COMPOSE_PROD := docker compose -f docker-compose.prod.yml

.DEFAULT_GOAL := help

.PHONY: help
help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

# ---- development ----------------------------------------------------------

.PHONY: dev
dev: .env ## Start the dev stack (http://localhost:8300)
	$(COMPOSE_DEV) up

.PHONY: dev-build
dev-build: .env ## Rebuild images and start the dev stack
	$(COMPOSE_DEV) up --build

.PHONY: down
down: ## Stop the dev stack
	$(COMPOSE_DEV) down

.PHONY: logs
logs: ## Follow dev stack logs
	$(COMPOSE_DEV) logs -f

.PHONY: sh-api
sh-api: ## Shell into the api container
	$(COMPOSE_DEV) exec api sh

# ---- database -------------------------------------------------------------

.PHONY: migrate
migrate: ## Apply migrations in the running api container
	$(COMPOSE_DEV) exec api alembic upgrade head

.PHONY: revision
revision: ## Autogenerate a migration: make revision m="add deaths table"
	$(COMPOSE_DEV) exec api alembic revision --autogenerate -m "$(m)"

# ---- codegen & quality ----------------------------------------------------

.PHONY: gen-types
gen-types: ## Regenerate TS types from the running API's OpenAPI schema
	npm run gen:types

.PHONY: lint
lint: ## Run ruff and eslint
	cd apps/api && uv run ruff check .
	npm run lint

.PHONY: fmt
fmt: ## Format python and web sources
	cd apps/api && uv run ruff format .
	npm run format

# ---- production -----------------------------------------------------------

.PHONY: prod
prod: .env ## Build and start the production stack on 127.0.0.1:8300
	$(COMPOSE_PROD) up -d --build

.PHONY: prod-down
prod-down: ## Stop the production stack
	$(COMPOSE_PROD) down

.env:
	@echo "No .env found - copy .env.example to .env first." && exit 1
