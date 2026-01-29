package routes

import (
	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/handlers"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(
	router *gin.Engine,
	cfg *config.Config,
	requestHandler *handlers.RequestHandler,
	collectionHandler *handlers.CollectionHandler,
	historyHandler *handlers.HistoryHandler,
	environmentHandler *handlers.EnvironmentHandler,
) {
	// API group
	api := router.Group("/api")
	{
		// Public health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "ok",
				"message": "APEye API is running",
			})
		})

		// Protected routes - require Better-Auth session
		protected := api.Group("")
		protected.Use(middleware.SessionMiddleware(cfg))
		{
			// User info
			protected.GET("/user/me", func(c *gin.Context) {
				userID, _ := c.Get("user_id")
				userEmail, _ := c.Get("user_email")
				userName, _ := c.Get("user_name")

				c.JSON(200, gin.H{
					"id":    userID,
					"email": userEmail,
					"name":  userName,
				})
			})

			// Execute API request
			protected.POST("/requests/execute", requestHandler.ExecuteRequest)

			// Collections
			protected.GET("/collections", collectionHandler.ListCollections)
			protected.POST("/collections", collectionHandler.CreateCollection)
			protected.GET("/collections/:id", collectionHandler.GetCollection)
			protected.PUT("/collections/:id", collectionHandler.UpdateCollection)
			protected.DELETE("/collections/:id", collectionHandler.DeleteCollection)

			// Saved Requests
			protected.POST("/requests", collectionHandler.SaveRequest)
			protected.DELETE("/requests/:id", collectionHandler.DeleteRequest)

			// History
			protected.GET("/history", historyHandler.ListHistory)
			protected.POST("/history", historyHandler.CreateHistory)
			protected.DELETE("/history/:id", historyHandler.DeleteHistory)
			protected.DELETE("/history", historyHandler.ClearAllHistory)

			// Environments
			protected.GET("/environments", environmentHandler.ListEnvironments)
			protected.POST("/environments", environmentHandler.CreateEnvironment)
			protected.GET("/environments/:id", environmentHandler.GetEnvironment)
			protected.PUT("/environments/:id", environmentHandler.UpdateEnvironment)
			protected.DELETE("/environments/:id", environmentHandler.DeleteEnvironment)
		}
	}
}
