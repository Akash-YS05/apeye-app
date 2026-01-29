package repository

import (
	"errors"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EnvironmentRepository struct {
	db *gorm.DB
}

func NewEnvironmentRepository(db *gorm.DB) *EnvironmentRepository {
	return &EnvironmentRepository{db: db}
}

// Create creates a new environment
func (r *EnvironmentRepository) Create(environment *models.Environment) error {
	return r.db.Create(environment).Error
}

// FindByID finds an environment by ID
func (r *EnvironmentRepository) FindByID(id uuid.UUID) (*models.Environment, error) {
	var environment models.Environment
	err := r.db.First(&environment, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &environment, nil
}

// FindByWorkspaceID finds all environments for a workspace
func (r *EnvironmentRepository) FindByWorkspaceID(workspaceID uuid.UUID) ([]models.Environment, error) {
	var environments []models.Environment
	err := r.db.Where("workspace_id = ?", workspaceID).
		Order("created_at ASC").
		Find(&environments).Error
	return environments, err
}

// Update updates an environment
func (r *EnvironmentRepository) Update(environment *models.Environment) error {
	return r.db.Save(environment).Error
}

// Delete deletes an environment
func (r *EnvironmentRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Environment{}, "id = ?", id).Error
}
