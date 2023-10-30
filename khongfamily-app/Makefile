dev-run:
	@echo "Running dev server..."
	@npm run dev

build:
	@echo "Building..."
	@npm run build

start:
	@echo "Starting..."
	@npm run start

docker-up:
	@echo "Starting docker..."
	@docker compose -f ./docker/docker-compose.yml up -d --build

docker-down:
	@echo "Stopping docker..."
	@docker compose -f ./docker/docker-compose.yml down

docker-logs:
	@echo "Showing docker logs..."
	@docker compose -f ./docker/docker-compose.yml logs -f

docker-down-up:
	@echo "Restarting docker..."
	@docker compose -f ./docker/docker-compose.yml down
	@docker compose -f ./docker/docker-compose.yml up -d --build