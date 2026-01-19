package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/handlers"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/middleware"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/repository"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/routes"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/services"
	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/database"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Set Gin mode
	gin.SetMode(cfg.Server.GinMode)

	// Connect to database
	if err := database.Connect(&cfg.Database); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	// Auto-migrate
	if err := database.AutoMigrate(); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Initialize repositories
	historyRepo := repository.NewHistoryRepository(database.GetDB())
	collectionRepo := repository.NewCollectionRepository(database.GetDB())
	workspaceRepo := repository.NewWorkspaceRepository(database.GetDB())
	requestRepo := repository.NewRequestRepository(database.GetDB())

	// Initialize services
	requestService := services.NewRequestService(historyRepo)
	collectionService := services.NewCollectionService(collectionRepo, workspaceRepo, requestRepo)

	// Initialize handlers
	requestHandler := handlers.NewRequestHandler(requestService)
	collectionHandler := handlers.NewCollectionHandler(collectionService)
	historyHandler := handlers.NewHistoryHandler(historyRepo) 

	// Initialize router
	router := gin.Default()

	// Apply CORS middleware
	router.Use(middleware.CORSMiddleware(cfg))

	// Setup routes
	routes.SetupRoutes(router, cfg, requestHandler, collectionHandler, historyHandler)

	// Start server
	log.Printf("🚀 Server starting on port %s", cfg.Server.Port)
	log.Println("📝 Authentication handled by Better-Auth on frontend")
	log.Println("🔥 HTTP client ready to execute requests")
	log.Println("📁 Collections management enabled")
	
	if err := router.Run(":" + cfg.Server.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}