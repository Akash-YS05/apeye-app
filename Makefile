.PHONY: help dev-up dev-down backend frontend install-frontend install-backend test clean

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev-up: ## Start PostgreSQL and Redis
	docker-compose up -d
	@echo "Database services started"

dev-down: ## Stop PostgreSQL and Redis
	docker-compose down
	@echo "Database services stopped"

install-frontend: ## Install frontend dependencies
	cd apeye-frontend && npm install
	@echo "Frontend dependencies installed"

install-backend: ## Install backend dependencies
	cd apeye-backend && go mod download
	@echo "Backend dependencies installed"

backend: ## Run backend server
	cd apeye-backend && go run cmd/api/main.go

frontend: ## Run frontend dev server
	cd apeye-frontend && npm run dev

db-reset: ## Reset database (drop and recreate)
	docker-compose down -v
	docker-compose up -d
	@echo "⏳ Waiting for database to be ready..."
	@sleep 3
	@echo "Database reset complete. Run 'make backend' to recreate tables."

db-connect: ## Connect to PostgreSQL
	docker exec -it apeye-postgres psql -U postgres -d apeye

clean: ## Clean up everything
	docker-compose down -v
	rm -rf apeye-frontend/node_modules
	rm -rf apeye-frontend/.next
	@echo "Cleaned up"