POSTGRES_DSN = "postgres://khongadmin:khong1314Family@localhost:5432/khongfamily?sslmode=disable"

build:
	@echo "Building..."
	go build -o bin/khongfamily ./cmd/khongfamily-broker/main.go
	@echo "Build success"

run: build
	@echo "Running..."
	./bin/khongfamily-broker

migrate-create:
	@echo "Creating migration..."
	migrate create -ext sql -dir ./migrations -seq ${NAME}

migrate-up:
	@echo "Migrating up..."
	migrate -path ./migrations -database ${POSTGRES_DSN} up

migrate-down:
	@echo "Migrating down..."
	migrate -path ./migrations -database ${POSTGRES_DSN} down

migrate-force:
	@echo "Migrating force..."
	migrate -path ./migrations -database ${POSTGRES_DSN} force ${VERSION}
	
docker-up:
	@echo "Building docker image..."
	docker compose -f ./docker/docker-compose.yml up -d --build

docker-down:
	@echo "Stopping docker image..."
	docker compose -f ./docker/docker-compose.yml down

docker-down-up:
	@echo "Stopping docker image..."
	docker compose -f ./docker/docker-compose.yml down
	@echo "Building docker image..."
	docker compose -f ./docker/docker-compose.yml up -d --build
