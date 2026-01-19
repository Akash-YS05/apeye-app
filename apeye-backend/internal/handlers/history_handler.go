package handlers

import (
	"net/http"
	"strconv"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/middleware"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type HistoryHandler struct {
	historyRepo *repository.HistoryRepository
}

func NewHistoryHandler(historyRepo *repository.HistoryRepository) *HistoryHandler {
	return &HistoryHandler{
		historyRepo: historyRepo,
	}
}

// ListHistory returns user's request history
func (h *HistoryHandler) ListHistory(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Get limit from query params (default 50)
	limitStr := c.DefaultQuery("limit", "50")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 50
	}

	history, err := h.historyRepo.FindByUserID(userID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch history"})
		return
	}

	c.JSON(http.StatusOK, history)
}

// DeleteHistory deletes a single history item
func (h *HistoryHandler) DeleteHistory(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	historyID := c.Param("id")
	id, err := uuid.Parse(historyID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid history ID"})
		return
	}

	// Verify ownership before deleting
	history, err := h.historyRepo.FindByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find history item"})
		return
	}
	if history == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "History item not found"})
		return
	}
	if history.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	if err := h.historyRepo.Delete(historyID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "History deleted"})
}

// ClearAllHistory deletes all history for the user
func (h *HistoryHandler) ClearAllHistory(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if err := h.historyRepo.DeleteByUserID(userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "History cleared"})
}