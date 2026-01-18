package handlers

import (
	"log"
	"net/http"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/middleware"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/services"
	"github.com/gin-gonic/gin"
)

type CollectionHandler struct {
	collectionService *services.CollectionService
}

func NewCollectionHandler(collectionService *services.CollectionService) *CollectionHandler {
	return &CollectionHandler{
		collectionService: collectionService,
	}
}

// ListCollections returns all collections for the user
func (h *CollectionHandler) ListCollections(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	collections, err := h.collectionService.GetUserCollections(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch collections"})
		return
	}

	c.JSON(http.StatusOK, collections)
}

// CreateCollection creates a new collection
func (h *CollectionHandler) CreateCollection(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	log.Println("CreateCollection userID:", userID)

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input services.CreateCollectionInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// log.Printf("CreateCollection input: %+v\n", input)

	collection, err := h.collectionService.CreateCollection(userID, input)
	if err != nil {
		log.Println("CreateCollection service error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("CreateCollection success: %+v\n", collection)
	c.JSON(http.StatusCreated, collection)
}

// GetCollection returns a single collection
func (h *CollectionHandler) GetCollection(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	collectionID := c.Param("id")
	collection, err := h.collectionService.GetCollection(userID, collectionID)
	if err != nil {
		if err == services.ErrCollectionNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Collection not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, collection)
}

// UpdateCollection updates a collection
func (h *CollectionHandler) UpdateCollection(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	collectionID := c.Param("id")
	var input services.UpdateCollectionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection, err := h.collectionService.UpdateCollection(userID, collectionID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, collection)
}

// DeleteCollection deletes a collection
func (h *CollectionHandler) DeleteCollection(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	collectionID := c.Param("id")
	if err := h.collectionService.DeleteCollection(userID, collectionID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Collection deleted"})
}

// SaveRequest saves a request to a collection
func (h *CollectionHandler) SaveRequest(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input services.SaveRequestInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	request, err := h.collectionService.SaveRequest(userID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, request)
}

// DeleteRequest deletes a saved request
func (h *CollectionHandler) DeleteRequest(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	requestID := c.Param("id")
	if err := h.collectionService.DeleteRequest(userID, requestID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Request deleted"})
}