package db

import (
	"database/sql"
	"fmt"
	"log/slog"

	"github.com/kokweikhong/khongfamily-broker/internal/config"
	_ "github.com/lib/pq"
)

var db *sql.DB

func Init() error {
	// postgres://user:password@host:port/dbname

	connectionString := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config.Cfg.PostgresHost,
		config.Cfg.PostgresPort,
		config.Cfg.PostgresUser,
		config.Cfg.PostgresPassword,
		config.Cfg.PostgresDBName,
	)

	slog.Info("Connecting to database", "connectionString", connectionString)

	postgresDB, err := sql.Open("postgres", connectionString)
	if err != nil {
		slog.Error("Error opening database", "error", err)
		return err
	}

	if err = postgresDB.Ping(); err != nil {
		slog.Error("Error connecting to database", "error", err)
		return err
	}

	db = postgresDB

	slog.Info("Successfully connected to database!")

	return nil
}

func Close() {
	if db != nil {
		db.Close()
	}
}

func GetDB() *sql.DB {
	return db
}
