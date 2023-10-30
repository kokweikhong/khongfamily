package config

import (
	"log/slog"

	"github.com/spf13/viper"
)

type Config struct {
	ServerListenAddr string `mapstructure:"SERVER_LISTEN_ADDR"`
	PostgresHost     string `mapstructure:"POSTGRES_HOST"`
	PostgresPort     string `mapstructure:"POSTGRES_PORT"`
	PostgresUser     string `mapstructure:"POSTGRES_USER"`
	PostgresPassword string `mapstructure:"POSTGRES_PASSWORD"`
	PostgresDBName   string `mapstructure:"POSTGRES_DB"`
	JwtSecret        string `mapstructure:"JWT_SECRET"`
}

var Cfg Config

func Init() error {
	if err := readConfig(); err != nil {
		slog.Error("Error reading config file", err)
		return err
	}

	if err := viper.Unmarshal(&Cfg); err != nil {
		slog.Error("Error unmarshalling config file", err)
		return err
	}

	slog.Info("Config initialized")

	return nil
}

func readConfig() error {
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath("./internal/config/")
	viper.AddConfigPath("../config/")
    viper.AddConfigPath(".")
    viper.AddConfigPath("./app")

	return viper.ReadInConfig()
}
