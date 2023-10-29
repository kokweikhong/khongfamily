frontend-run:
	@echo "Running frontend..."
	@cd frontend && npm run dev

backend-run:
	@echo "Running backend..."
	@cd backend && ./bin/khongfamily

app-run: frontend-run backend-run

docker-up:
	@echo "Running docker-compose up..."
	@docker compose -f ./dockerfiles/docker-compose.yml up -d --build
	@echo "Done running docker-compose up"

docker-down:
	@echo "Running docker-compose down..."
	@docker compose -f ./dockerfiles/docker-compose.yml down
	@echo "Done running docker-compose down"

docker-down-up: docker-down docker-up

