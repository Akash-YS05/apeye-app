package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/middleware"
)

func SetupRoutes(router *gin.Engine, cfg *config.Config) {
	// API v1 group
	api := router.Group("/api")
	{
		// Public health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "ok",
				"message": "APEye API v1 is running",
			})
		})

		// Protected routes - require Better-Auth session
		protected := api.Group("")
		protected.Use(middleware.SessionMiddleware(cfg))
		{
			// User info (from session)
			protected.GET("/user/me", func(c *gin.Context) {
				userID, _ := c.Get("user_id")
				userEmail, _ := c.Get("user_email")
				
				c.JSON(200, gin.H{
					"id":    userID,
					"email": userEmail,
				})
			})
			
			// Future API routes will go here
			// protected.GET("/collections", collectionHandler.List)
			// protected.POST("/requests/execute", requestHandler.Execute)
		}
	}
}