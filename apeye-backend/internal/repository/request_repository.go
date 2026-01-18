package repository

import (
	"errors"

	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RequestRepository struct {
	db *gorm.DB
}

func NewRequestRepository(db *gorm.DB) *RequestRepository {
	return &RequestRepository{db: db}
}

// Create creates a new saved request
func (r *RequestRepository) Create(request *models.Request) error {
	return r.db.Create(request).Error
}

// FindByID finds a request by ID
func (r *RequestRepository) FindByID(id uuid.UUID) (*models.Request, error) {
	var request models.Request
	err := r.db.First(&request, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &request, nil
}

// FindByCollectionID finds all requests in a collection
func (r *RequestRepository) FindByCollectionID(collectionID uuid.UUID) ([]models.Request, error) {
	var requests []models.Request
	err := r.db.Where("collection_id = ?", collectionID).
		Order("created_at DESC").
		Find(&requests).Error
	return requests, err
}

// Update updates a request
func (r *RequestRepository) Update(request *models.Request) error {
	return r.db.Save(request).Error
}

// Delete deletes a request
func (r *RequestRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Request{}, "id = ?", id).Error
}