package services

import (
	"errors"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/repository"
	"github.com/google/uuid"
)

var (
	ErrCollectionNotFound = errors.New("collection not found")
	ErrUnauthorized       = errors.New("unauthorized access")
)

type CollectionService struct {
	collectionRepo *repository.CollectionRepository
	workspaceRepo  *repository.WorkspaceRepository
	requestRepo    *repository.RequestRepository
}

func NewCollectionService(
	collectionRepo *repository.CollectionRepository,
	workspaceRepo *repository.WorkspaceRepository,
	requestRepo *repository.RequestRepository,
) *CollectionService {
	return &CollectionService{
		collectionRepo: collectionRepo,
		workspaceRepo:  workspaceRepo,
		requestRepo:    requestRepo,
	}
}

type CreateCollectionInput struct {
	WorkspaceID string `json:"workspace_id" binding:"required"`
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

type UpdateCollectionInput struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type SaveRequestInput struct {
	CollectionID string                 `json:"collection_id" binding:"required"`
	Name         string                 `json:"name" binding:"required"`
	Method       string                 `json:"method" binding:"required"`
	URL          string                 `json:"url" binding:"required"`
	Headers      map[string]interface{} `json:"headers"`
	Params       map[string]interface{} `json:"params"`
	Auth         map[string]interface{} `json:"auth"`
	Body         map[string]interface{} `json:"body"`
}

// GetUserCollections returns all collections for a user
func (s *CollectionService) GetUserCollections(userID string) ([]models.Collection, error) {
	// Get user's default workspace
	workspace, err := s.workspaceRepo.FindDefaultByUserID(userID)
	if err != nil {
		return nil, err
	}

	// Get collections for workspace
	collections, err := s.collectionRepo.FindByWorkspaceID(workspace.ID)
	if err != nil {
		return nil, err
	}

	return collections, nil
}

// CreateCollection creates a new collection
func (s *CollectionService) CreateCollection(userID string, input CreateCollectionInput) (*models.Collection, error) {
	var workspaceID uuid.UUID
	var err error

	if input.WorkspaceID == "" || 
	   input.WorkspaceID == "default" || 
	   input.WorkspaceID == "default-workspace-id" {
		// Get or create the user's default workspace
		workspace, err := s.workspaceRepo.FindDefaultByUserID(userID)
		if err != nil {
			return nil, err
		}
		workspaceID = workspace.ID
	} else {
		// Parse provided workspace ID
		workspaceID, err = uuid.Parse(input.WorkspaceID)
		if err != nil {
			return nil, errors.New("invalid workspace ID format")
		}

		// Verify workspace exists and belongs to user
		workspace, err := s.workspaceRepo.FindByID(workspaceID)
		if err != nil {
			return nil, err
		}
		if workspace == nil {
			return nil, errors.New("workspace not found")
		}
		if workspace.UserID != userID {
			return nil, ErrUnauthorized
		}
	}

	collection := &models.Collection{
		WorkspaceID: workspaceID,
		Name:        input.Name,
		Description: input.Description,
	}

	if err := s.collectionRepo.Create(collection); err != nil {
		return nil, err
	}

	return collection, nil
}

// GetCollection returns a collection by ID
func (s *CollectionService) GetCollection(userID string, collectionID string) (*models.Collection, error) {
	id, err := uuid.Parse(collectionID)
	if err != nil {
		return nil, errors.New("invalid collection ID")
	}

	collection, err := s.collectionRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if collection == nil {
		return nil, ErrCollectionNotFound
	}

	// Verify user owns the workspace
	workspace, err := s.workspaceRepo.FindByID(collection.WorkspaceID)
	if err != nil {
		return nil, err
	}
	if workspace.UserID != userID {
		return nil, ErrUnauthorized
	}

	return collection, nil
}

// UpdateCollection updates a collection
func (s *CollectionService) UpdateCollection(userID string, collectionID string, input UpdateCollectionInput) (*models.Collection, error) {
	collection, err := s.GetCollection(userID, collectionID)
	if err != nil {
		return nil, err
	}

	if input.Name != "" {
		collection.Name = input.Name
	}
	collection.Description = input.Description

	if err := s.collectionRepo.Update(collection); err != nil {
		return nil, err
	}

	return collection, nil
}

// DeleteCollection deletes a collection
func (s *CollectionService) DeleteCollection(userID string, collectionID string) error {
	_, err := s.GetCollection(userID, collectionID)
	if err != nil {
		return err
	}

	id, _ := uuid.Parse(collectionID)
	return s.collectionRepo.Delete(id)
}

// SaveRequest saves a request to a collection
func (s *CollectionService) SaveRequest(userID string, input SaveRequestInput) (*models.Request, error) {
	collectionID, err := uuid.Parse(input.CollectionID)
	if err != nil {
		return nil, errors.New("invalid collection ID")
	}

	// Verify collection belongs to user
	collection, err := s.GetCollection(userID, input.CollectionID)
	if err != nil {
		return nil, err
	}

	// Convert maps to JSONB
	headers := models.JSONB{}
	if input.Headers != nil {
		headers = models.JSONB(input.Headers)
	}

	params := models.JSONB{}
	if input.Params != nil {
		params = models.JSONB(input.Params)
	}

	auth := models.JSONB{}
	if input.Auth != nil {
		auth = models.JSONB(input.Auth)
	}

	body := models.JSONB{}
	if input.Body != nil {
		body = models.JSONB(input.Body)
	}

	request := &models.Request{
		CollectionID: collectionID,
		Name:         input.Name,
		Method:       models.HTTPMethod(input.Method),
		URL:          input.URL,
		Headers:      headers,
		Params:       params,
		Auth:         auth,
		Body:         body,
	}

	if err := s.requestRepo.Create(request); err != nil {
		return nil, err
	}

	// Reload with collection data
	request.Collection = *collection

	return request, nil
}

// DeleteRequest deletes a saved request
func (s *CollectionService) DeleteRequest(userID string, requestID string) error {
	id, err := uuid.Parse(requestID)
	if err != nil {
		return errors.New("invalid request ID")
	}

	// Get request
	request, err := s.requestRepo.FindByID(id)
	if err != nil {
		return err
	}
	if request == nil {
		return errors.New("request not found")
	}

	// Verify user owns the collection
	_, err = s.GetCollection(userID, request.CollectionID.String())
	if err != nil {
		return err
	}

	return s.requestRepo.Delete(id)
}