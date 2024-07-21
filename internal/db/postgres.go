package db

import (
	"context"
	"fmt"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	postgresDB *pgxpool.Pool
)

func InitDB() error {
	connStr := fmt.Sprintf(
		"user=%s password=%s host=%s port=%s dbname=%s sslmode=disable",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	var err error
	postgresDB, err = pgxpool.New(
		context.Background(),
		connStr,
	)
	if err != nil {
		slog.Error("Unable to connect to database", "error", err)
		return err
	}

	if err = postgresDB.Ping(context.Background()); err != nil {
		slog.Error("Unable to ping database", "error", err)
		return err
	}

	slog.Info("Database connection established", "database", os.Getenv("DB_NAME"))
	return nil
}

func GetDB() *pgxpool.Pool {
	return postgresDB
}

func CloseDB() {
	postgresDB.Close()
	slog.Info("Database connection closed")
}
