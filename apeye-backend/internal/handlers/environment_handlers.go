package handlers

import (
	"net/http"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/middleware"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/services"
	"github.com/gin-gonic/gin"
)

type EnvironmentHandler struct {
	environmentService *services.EnvironmentService
}

func NewEnvironmentHandler(environmentService *services.EnvironmentService) *EnvironmentHandler {
	return &EnvironmentHandler{
		environmentService: environmentService,
	}
}

// ListEnvironments returns all environments for the user
func (h *EnvironmentHandler) ListEnvironments(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	environments, err := h.environmentService.GetUserEnvironments(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch environments"})
		return
	}

	c.JSON(http.StatusOK, environments)
}

// CreateEnvironment creates a new environment
func (h *EnvironmentHandler) CreateEnvironment(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input services.CreateEnvironmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	environment, err := h.environmentService.CreateEnvironment(userID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, environment)
}

// GetEnvironment returns a single environment
func (h *EnvironmentHandler) GetEnvironment(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	environmentID := c.Param("id")
	environment, err := h.environmentService.GetEnvironment(userID, environmentID)
	if err != nil {
		if err == services.ErrEnvironmentNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Environment not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, environment)
}

// UpdateEnvironment updates an environment
func (h *EnvironmentHandler) UpdateEnvironment(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	environmentID := c.Param("id")
	var input services.UpdateEnvironmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	environment, err := h.environmentService.UpdateEnvironment(userID, environmentID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, environment)
}

// DeleteEnvironment deletes an environment
func (h *EnvironmentHandler) DeleteEnvironment(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	environmentID := c.Param("id")
	if err := h.environmentService.DeleteEnvironment(userID, environmentID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Environment deleted"})
}
