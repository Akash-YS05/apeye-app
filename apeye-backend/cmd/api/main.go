package main

import (
	"log"

	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	gin.SetMode(cfg.Server.GinMode)

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "OK",
			"message": "APEye server is running",
		})
	})

	log.Printf("Port starting on server %s", cfg.Server.Port)
	if err := router.Run(":" + cfg.Server.Port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}