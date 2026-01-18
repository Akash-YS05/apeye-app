.PHONY: help dev-up dev-down backend backend-watch frontend install-frontend install-backend db-connect clean

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev-up: ## Start PostgreSQL and Redis
	docker-compose up -d
	@echo "✅ Database services started"

dev-down: ## Stop PostgreSQL and Redis
	docker-compose down
	@echo "✅ Database services stopped"

install-frontend: ## Install frontend dependencies
	cd apeye-frontend && npm install
	@echo "✅ Frontend dependencies installed"

install-backend: ## Install backend dependencies
	cd apeye-backend && go mod download
	@echo "✅ Backend dependencies installed"

backend: ## Run backend server (manual restart)
	cd apeye-backend && go run cmd/api/main.go

backend-watch: ## Run backend with auto-reload (recommended)
	cd apeye-backend && air

frontend: ## Run frontend dev server
	cd apeye-frontend && npm run dev

db-connect: ## Connect to PostgreSQL
	psql "$(DATABASE_URL)"

clean: ## Clean up everything
	docker-compose down -v
	rm -rf apeye-frontend/node_modules
	rm -rf apeye-frontend/.next
	rm -rf apeye-backend/tmp
	@echo "✅ Cleaned up"