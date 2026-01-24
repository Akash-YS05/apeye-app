package config

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Server    ServerConfig
	Database  DatabaseConfig
	Redis     RedisConfig
	JWT       JWTConfig
	CORS      CORSConfig
	RateLimit RateLimitConfig
}

type ServerConfig struct {
	Port    string
	GinMode string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

type JWTConfig struct {
	Secret             string
	Expiry             time.Duration
	RefreshTokenExpiry time.Duration
}

type CORSConfig struct {
	AllowedOrigins []string
}

type RateLimitConfig struct {
	Free int
	Pro  int
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	return &Config{
		Server: ServerConfig{
			Port:    getEnv("PORT", "8080"),
			GinMode: getEnv("GIN_MODE", "debug"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			DBName:   getEnv("DB_NAME", "apeye"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnv("REDIS_PORT", "6379"),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       0,
		},
		JWT: JWTConfig{
			Secret:             getEnv("JWT_SECRET", "your-secret-key"),
			Expiry:             24 * time.Hour,
			RefreshTokenExpiry: 7 * 24 * time.Hour,
		},
		CORS: CORSConfig{
			AllowedOrigins: getEnvSlice("ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
		},
		RateLimit: RateLimitConfig{
			Free: 100,
			Pro:  10000,
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvSlice(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		return strings.Split(value, ",")
	}
	return defaultValue
}
