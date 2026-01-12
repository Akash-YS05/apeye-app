// package main

// import (
// 	"log"

// 	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
// 	"github.com/gin-gonic/gin"
// )

// func main() {
// 	cfg := config.Load()

// 	gin.SetMode(cfg.Server.GinMode)

// 	router := gin.Default()

// 	router.GET("/health", func(c *gin.Context) {
// 		c.JSON(200, gin.H{
// 			"status": "OK",
// 			"message": "APEye server is running",
// 		})
// 	})

// 	log.Printf("Port starting on server %s", cfg.Server.Port)
// 	if err := router.Run(":" + cfg.Server.Port); err != nil {
// 		log.Fatal("Failed to start server: ", err)
// 	}
// }

package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/database"
)

func main() {
	cfg := config.Load()

	gin.SetMode(cfg.Server.GinMode)

	if err := database.Connect(&cfg.Database); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	// Auto-migrate creates/updates tables automatically
	if err := database.AutoMigrate(); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Seed database in development mode
	// if cfg.Server.GinMode == "debug" {
	// 	if err := database.Seed(); err != nil {
	// 		log.Println("⚠️  Warning: Failed to seed database:", err)
	// 	}
	// }

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":   "ok",
			"message":  "APEye API is running",
			"database": "connected",
		})
	})

	router.GET("/health/db", func(c *gin.Context) {
		sqlDB, err := database.DB.DB()
		if err != nil {
			c.JSON(500, gin.H{"status": "error", "message": err.Error()})
			return
		}

		if err := sqlDB.Ping(); err != nil {
			c.JSON(500, gin.H{"status": "error", "message": "Database ping failed"})
			return
		}

		c.JSON(200, gin.H{"status": "ok", "message": "Database is healthy"})
	})

	log.Printf("Starting server on port %s", cfg.Server.Port)
	if err := router.Run(":" + cfg.Server.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}