package handlers

import (
	"net/http"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/middleware"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/services"
	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/httpclient"
	"github.com/gin-gonic/gin"
)

type RequestHandler struct {
	requestService *services.RequestService
}

func NewRequestHandler(requestService *services.RequestService) *RequestHandler {
	return &RequestHandler{
		requestService: requestService,
	}
}

// ExecuteRequest handles API request execution
func (h *RequestHandler) ExecuteRequest(c *gin.Context) {
	// Get user ID from context
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse request config
	var config httpclient.RequestConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request configuration: " + err.Error()})
		return
	}

	// Validate URL
	if config.URL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL is required"})
		return
	}

	// Execute request
	response, err := h.requestService.ExecuteRequest(userID, config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute request: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}