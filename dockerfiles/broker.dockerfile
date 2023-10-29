FROM golang:1.21.2-alpine3.18 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
# RUN go build -v -o /app/bin/ ./cmd/khongfamily
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin ./cmd/khongfamily-broker

# Run the tests in the container
# FROM build-stage AS run-test-stage
# RUN go test -v ./...

# Deploy the application binary into a lean image
FROM gcr.io/distroless/base-debian11 AS build-release-stage

WORKDIR /

COPY --from=build-stage /app/bin/khongfamily-broker /app/bin/khongfamily-broker

# Copy the environment file
COPY --from=build-stage /app/internal/config/.env /app/.env

USER nonroot:nonroot

ENTRYPOINT ["/app/bin/khongfamily-broker"]

# CMD ["/app/bin/khongfamily"]

