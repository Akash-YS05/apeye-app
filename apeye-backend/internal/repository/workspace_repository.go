package repository

import (
	"errors"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type WorkspaceRepository struct {
	db *gorm.DB
}

func NewWorkspaceRepository(db *gorm.DB) *WorkspaceRepository {
	return &WorkspaceRepository{db: db}
}

// Create creates a new workspace
func (r *WorkspaceRepository) Create(workspace *models.Workspace) error {
	return r.db.Create(workspace).Error
}

// FindByID finds a workspace by ID
func (r *WorkspaceRepository) FindByID(id uuid.UUID) (*models.Workspace, error) {
	var workspace models.Workspace
	err := r.db.Preload("Collections").Preload("Environments").
		First(&workspace, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &workspace, nil
}

// FindByUserID finds all workspaces for a user
func (r *WorkspaceRepository) FindByUserID(userID string) ([]models.Workspace, error) {
	var workspaces []models.Workspace
	//case-sensitive match (annoying bug)
	err := r.db.Where(`"userId" = ?`, userID).
		Preload("Collections").
		Order("created_at DESC").
		Find(&workspaces).Error
	return workspaces, err
}

// FindDefaultByUserID finds or creates default workspace for user
func (r *WorkspaceRepository) FindDefaultByUserID(userID string) (*models.Workspace, error) {
	var workspace models.Workspace
	//case-sensitive match (annoying bug)
	err := r.db.Where(`"userId" = ?`, userID).
		Order("created_at ASC").
		First(&workspace).Error
	
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// Create default workspace
		workspace = models.Workspace{
			UserID: userID,
			Name:   "My Workspace",
		}
		if err := r.Create(&workspace); err != nil {
			return nil, err
		}
		return &workspace, nil
	}
	
	if err != nil {
		return nil, err
	}
	
	return &workspace, nil
}

// Update updates a workspace
func (r *WorkspaceRepository) Update(workspace *models.Workspace) error {
	return r.db.Save(workspace).Error
}

// Delete deletes a workspace
func (r *WorkspaceRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Workspace{}, "id = ?", id).Error
}