package repository

import (
	"errors"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CollectionRepository struct {
	db *gorm.DB
}

func NewCollectionRepository(db *gorm.DB) *CollectionRepository {
	return &CollectionRepository{db: db}
}

// Create creates a new collection
func (r *CollectionRepository) Create(collection *models.Collection) error {
	return r.db.Create(collection).Error
}

// FindByID finds a collection by ID
func (r *CollectionRepository) FindByID(id uuid.UUID) (*models.Collection, error) {
	var collection models.Collection
	err := r.db.Preload("Requests").First(&collection, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &collection, nil
}

// FindByWorkspaceID finds all collections for a workspace
func (r *CollectionRepository) FindByWorkspaceID(workspaceID uuid.UUID) ([]models.Collection, error) {
	var collections []models.Collection
	err := r.db.Where("workspace_id = ?", workspaceID).
		Preload("Requests").
		Order("created_at DESC").
		Find(&collections).Error
	return collections, err
}

// Update updates a collection
func (r *CollectionRepository) Update(collection *models.Collection) error {
	return r.db.Save(collection).Error
}

// Delete deletes a collection
func (r *CollectionRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Collection{}, "id = ?", id).Error
}