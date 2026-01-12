package main

import (
	"log"

	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/handlers"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/middleware"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/repository"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/routes"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/services"
	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/database"
	"github.com/gin-gonic/gin"
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

	userRepo := repository.NewUserRepository(database.GetDB())

	authService := services.NewAuthService(userRepo, cfg)

	authHandler := handlers.NewAuthHandler(authService)

	router := gin.Default()

	router.Use(middleware.CORSMiddleware(cfg))

	routes.SetupRoutes(router, authHandler, cfg)


	log.Printf("Starting server on port %s", cfg.Server.Port)
	if err := router.Run(":" + cfg.Server.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}