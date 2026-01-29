package services

import (
	"errors"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/repository"
	"github.com/google/uuid"
)

var (
	ErrEnvironmentNotFound = errors.New("environment not found")
)

type EnvironmentService struct {
	environmentRepo *repository.EnvironmentRepository
	workspaceRepo   *repository.WorkspaceRepository
}

func NewEnvironmentService(
	environmentRepo *repository.EnvironmentRepository,
	workspaceRepo *repository.WorkspaceRepository,
) *EnvironmentService {
	return &EnvironmentService{
		environmentRepo: environmentRepo,
		workspaceRepo:   workspaceRepo,
	}
}

type CreateEnvironmentInput struct {
	WorkspaceID string            `json:"workspace_id"`
	Name        string            `json:"name" binding:"required"`
	Variables   map[string]string `json:"variables"`
}

type UpdateEnvironmentInput struct {
	Name      string            `json:"name"`
	Variables map[string]string `json:"variables"`
}

// GetUserEnvironments returns all environments for a user's default workspace
func (s *EnvironmentService) GetUserEnvironments(userID string) ([]models.Environment, error) {
	// Get user's default workspace
	workspace, err := s.workspaceRepo.FindDefaultByUserID(userID)
	if err != nil {
		return nil, err
	}

	// Get environments for workspace
	environments, err := s.environmentRepo.FindByWorkspaceID(workspace.ID)
	if err != nil {
		return nil, err
	}

	return environments, nil
}

// CreateEnvironment creates a new environment
func (s *EnvironmentService) CreateEnvironment(userID string, input CreateEnvironmentInput) (*models.Environment, error) {
	var workspaceID uuid.UUID
	var err error

	if input.WorkspaceID == "" || input.WorkspaceID == "default" {
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

	// Convert map[string]string to JSONB
	variables := models.JSONB{}
	for k, v := range input.Variables {
		variables[k] = v
	}

	environment := &models.Environment{
		WorkspaceID: workspaceID,
		Name:        input.Name,
		Variables:   variables,
	}

	if err := s.environmentRepo.Create(environment); err != nil {
		return nil, err
	}

	return environment, nil
}

// GetEnvironment returns an environment by ID
func (s *EnvironmentService) GetEnvironment(userID string, environmentID string) (*models.Environment, error) {
	id, err := uuid.Parse(environmentID)
	if err != nil {
		return nil, errors.New("invalid environment ID")
	}

	environment, err := s.environmentRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if environment == nil {
		return nil, ErrEnvironmentNotFound
	}

	// Verify user owns the workspace
	workspace, err := s.workspaceRepo.FindByID(environment.WorkspaceID)
	if err != nil {
		return nil, err
	}
	if workspace.UserID != userID {
		return nil, ErrUnauthorized
	}

	return environment, nil
}

// UpdateEnvironment updates an environment
func (s *EnvironmentService) UpdateEnvironment(userID string, environmentID string, input UpdateEnvironmentInput) (*models.Environment, error) {
	environment, err := s.GetEnvironment(userID, environmentID)
	if err != nil {
		return nil, err
	}

	if input.Name != "" {
		environment.Name = input.Name
	}

	if input.Variables != nil {
		// Convert map[string]string to JSONB
		variables := models.JSONB{}
		for k, v := range input.Variables {
			variables[k] = v
		}
		environment.Variables = variables
	}

	if err := s.environmentRepo.Update(environment); err != nil {
		return nil, err
	}

	return environment, nil
}

// DeleteEnvironment deletes an environment
func (s *EnvironmentService) DeleteEnvironment(userID string, environmentID string) error {
	_, err := s.GetEnvironment(userID, environmentID)
	if err != nil {
		return err
	}

	id, _ := uuid.Parse(environmentID)
	return s.environmentRepo.Delete(id)
}
