package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/httpclient"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	port := getEnv("AGENT_PORT", "6363")
	ginMode := getEnv("AGENT_GIN_MODE", getEnv("GIN_MODE", "debug"))
	allowedOrigins := getEnvSlice("AGENT_ALLOWED_ORIGINS", []string{"http://localhost:3000", "http://127.0.0.1:3000"})

	gin.SetMode(ginMode)

	client := httpclient.NewClient()
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())
	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: false,
	}))

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "apeye-local-agent",
		})
	})

	router.POST("/execute", func(c *gin.Context) {
		var config httpclient.RequestConfig
		if err := c.ShouldBindJSON(&config); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request configuration: " + err.Error()})
			return
		}

		if strings.TrimSpace(config.URL) == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "URL is required"})
			return
		}

		response, err := client.Execute(config)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": "Failed to execute request: " + err.Error()})
			return
		}

		c.JSON(http.StatusOK, response)
	})

	log.Printf("Local agent starting on http://127.0.0.1:%s", port)
	if err := router.Run("127.0.0.1:" + port); err != nil {
		log.Fatal("Failed to start local agent:", err)
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
		parts := strings.Split(value, ",")
		origins := make([]string, 0, len(parts))

		for _, part := range parts {
			origin := strings.TrimSpace(part)
			if origin != "" {
				origins = append(origins, origin)
			}
		}

		if len(origins) > 0 {
			return origins
		}
	}

	return defaultValue
}
