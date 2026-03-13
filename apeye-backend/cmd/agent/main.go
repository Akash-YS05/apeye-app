package main

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/httpclient"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var agentVersion = "dev"

type runtimeState struct {
	startedAt        time.Time
	lastRequestError string
	lastErrorAt      string
}

func main() {
	port := getEnv("AGENT_PORT", "6363")
	ginMode := getEnv("AGENT_GIN_MODE", getEnv("GIN_MODE", "release"))
	allowedOrigins := getEnvSlice("AGENT_ALLOWED_ORIGINS")
	agentToken, tokenSource, err := resolveAgentToken()
	if err != nil {
		log.Fatal("Failed to resolve agent token:", err)
	}

	gin.SetMode(ginMode)

	client := httpclient.NewClient()
	state := &runtimeState{startedAt: time.Now().UTC()}
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())
	if err := router.SetTrustedProxies(nil); err != nil {
		log.Fatal("Failed to configure trusted proxies:", err)
	}
	if len(allowedOrigins) == 0 {
		router.Use(cors.New(cors.Config{
			AllowAllOrigins: true,
			AllowMethods:    []string{"GET", "POST", "OPTIONS"},
			AllowHeaders:    []string{"Origin", "Content-Type", "Accept", "Authorization", "X-APEYE-Agent-Token"},
		}))
	} else {
		router.Use(cors.New(cors.Config{
			AllowOrigins:     allowedOrigins,
			AllowMethods:     []string{"GET", "POST", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-APEYE-Agent-Token"},
			AllowCredentials: false,
		}))
	}

	router.GET("/health", func(c *gin.Context) {
		if !hasValidAgentToken(c, agentToken) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid agent token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "apeye-local-agent",
			"version": agentVersion,
			"auth":    "token",
		})
	})

	router.GET("/version", func(c *gin.Context) {
		if !hasValidAgentToken(c, agentToken) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid agent token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"service": "apeye-local-agent",
			"version": agentVersion,
		})
	})

	router.GET("/diagnostics", func(c *gin.Context) {
		if !hasValidAgentToken(c, agentToken) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid agent token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"service":            "apeye-local-agent",
			"version":            agentVersion,
			"uptimeSeconds":      int(time.Since(state.startedAt).Seconds()),
			"lastRequestError":   state.lastRequestError,
			"lastRequestErrorAt": state.lastErrorAt,
		})
	})

	router.POST("/execute", func(c *gin.Context) {
		if !hasValidAgentToken(c, agentToken) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid agent token"})
			return
		}

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
			state.lastRequestError = err.Error()
			state.lastErrorAt = time.Now().UTC().Format(time.RFC3339)
			c.JSON(http.StatusBadGateway, gin.H{"error": "Failed to execute request: " + err.Error()})
			return
		}

		state.lastRequestError = ""
		state.lastErrorAt = ""

		c.JSON(http.StatusOK, response)
	})

	log.Printf("Local agent starting on http://127.0.0.1:%s", port)
	if len(allowedOrigins) == 0 {
		log.Println("Allowed origins: * (all origins enabled)")
	} else {
		log.Printf("Allowed origins: %s", strings.Join(allowedOrigins, ", "))
	}
	log.Printf("Version: %s", agentVersion)
	log.Printf("Pairing token: %s", agentToken)
	log.Printf("Token source: %s", tokenSource)
	log.Println("Use this token in the app Local Agent setup dialog")
	if os.Getenv("AGENT_ALLOWED_ORIGINS") == "" {
		log.Println("AGENT_ALLOWED_ORIGINS not set, allowing all origins")
	}
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

func getEnvSlice(key string) []string {
	if value := os.Getenv(key); value != "" {
		parts := strings.Split(value, ",")
		origins := make([]string, 0, len(parts))

		for _, part := range parts {
			origin := strings.TrimSpace(part)
			if origin != "" {
				origins = append(origins, origin)
			}
		}

		return origins
	}

	return []string{}
}

func generateToken() (string, error) {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}

	return hex.EncodeToString(buf), nil
}

func resolveAgentToken() (string, string, error) {
	if envToken := strings.TrimSpace(os.Getenv("AGENT_AUTH_TOKEN")); envToken != "" {
		return envToken, "AGENT_AUTH_TOKEN env", nil
	}

	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", "", err
	}

	tokenDir := filepath.Join(configDir, "APEye")
	tokenFile := filepath.Join(tokenDir, "agent.token")

	data, err := os.ReadFile(tokenFile)
	if err == nil {
		token := strings.TrimSpace(string(data))
		if token != "" {
			return token, tokenFile, nil
		}
	}

	if err != nil && !errors.Is(err, os.ErrNotExist) {
		return "", "", err
	}

	if mkErr := os.MkdirAll(tokenDir, 0o700); mkErr != nil {
		return "", "", mkErr
	}

	generatedToken, genErr := generateToken()
	if genErr != nil {
		return "", "", genErr
	}

	if writeErr := os.WriteFile(tokenFile, []byte(generatedToken), 0o600); writeErr != nil {
		return "", "", writeErr
	}

	return generatedToken, tokenFile, nil
}

func hasValidAgentToken(c *gin.Context, expected string) bool {
	token := strings.TrimSpace(c.GetHeader("X-APEYE-Agent-Token"))
	if token == "" {
		return false
	}

	return token == expected
}
