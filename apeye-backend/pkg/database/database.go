package database

import (
	"fmt"
	"log"
	"time"

	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Connect establishes database connection
func Connect(cfg *config.DatabaseConfig) error {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode,
	)

	var err error
	
	// Logger Levels:
	// logger.Silent  // No logs at all (cleanest)
	// logger.Error   // Only errors (recommended for production)
	// logger.Warn    // Errors + warnings
	// logger.Info    // Everything including slow queries (your current setting)
	// Set logger to Error level only (or Silent for no logs)
	
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error), // Changed from logger.Info
		NowFunc: func() time.Time {
			return time.Now().UTC()
		},
	})

	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	// Connection pool settings
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("✅ Database connected successfully")
	return nil
}

// AutoMigrate runs automatic migrations
func AutoMigrate() error {
	// Only migrate tables that GORM manages (not Better-Auth tables)
	err := DB.AutoMigrate(
		&models.Workspace{},
		&models.Collection{},
		&models.Request{},
		&models.Environment{},
		&models.History{},
		&models.Subscription{},
	)
	
	if err != nil {
		return fmt.Errorf("failed to auto migrate: %w", err)
	}
	
	log.Println("✅ Database migrations completed")
	return nil
}

// Close closes the database connection
func Close() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}