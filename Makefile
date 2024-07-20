build:
	@echo "Building..."
	@go build -o bin/app cmd/app/main.go

run: build
	@echo "Running..."
	@./bin/app


POSTGRES_DSN=postgres://admin@khongfamily:kkw.2024@Khongfamily@localhost:5432/khongfamily?sslmode=disable

pgweb:
	@echo "Starting pgweb..."
	@pgweb --url $(POSTGRES_DSN)

migrate-create:
	@echo "Creating migration..."
	@migrate create -ext sql -dir migrations $(name)

migrate-up:
	@echo "Migrating up..."
	@migrate -database $(POSTGRES_DSN) -path migrations up

migrate-down:
	@echo "Migrating down..."
	@migrate -database $(POSTGRES_DSN) -path migrations down

migrate-force:
	@echo "Forcing migration..."
	@migrate -database $(POSTGRES_DSN) -path migrations force $(version)

DOCKER_COMPOSE_FILE=deployments/docker-compose.yml

docker-up-name:
	@echo "Starting docker container... $(name)"
	@docker compose -f $(DOCKER_COMPOSE_FILE) up -d --build $(name)

docker-down-name:
	@echo "Stopping docker container... $(name)"
	@docker compose -f $(DOCKER_COMPOSE_FILE) down $(name)

docker-up:
	@echo "Starting docker container..."
	@docker compose -f $(DOCKER_COMPOSE_FILE) up -d --build

docker-down:
	@echo "Stopping docker container..."
	@docker compose -f $(DOCKER_COMPOSE_FILE) down

docker-logs:
	@echo "Showing logs..."
	@docker compose -f $(DOCKER_COMPOSE_FILE) logs -f

docker-ps:
	@echo "Showing running containers..."
	@docker compose -f $(DOCKER_COMPOSE_FILE) ps

sqlc-generate:
	@echo "Generating sqlc..."
	@sqlc -f internal/sqlc/sqlc.yaml generate
