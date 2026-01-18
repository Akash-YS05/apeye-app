package handlers

import (
	"net/http"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/middleware"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/repository"
	"github.com/gin-gonic/gin"
)

type WorkspaceHandler struct {
	workspaceRepo *repository.WorkspaceRepository
}

func NewWorkspaceHandler(workspaceRepo *repository.WorkspaceRepository) *WorkspaceHandler {
	return &WorkspaceHandler{workspaceRepo: workspaceRepo}
}

func (h *WorkspaceHandler) GetMyWorkspaces(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	workspaces, err := h.workspaceRepo.FindByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, workspaces)
}