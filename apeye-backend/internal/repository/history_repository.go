package repository

import (
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"gorm.io/gorm"
)

type HistoryRepository struct {
	db *gorm.DB
}

func NewHistoryRepository(db *gorm.DB) *HistoryRepository {
	return &HistoryRepository{db: db}
}

// Create saves a history record
func (r *HistoryRepository) Create(history *models.History) error {
	return r.db.Create(history).Error
}

// FindByUserID retrieves history for a user
func (r *HistoryRepository) FindByUserID(userID string, limit int) ([]models.History, error) {
	var history []models.History
	err := r.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Find(&history).Error
	return history, err
}

// Delete removes a history record
func (r *HistoryRepository) Delete(id string) error {
	return r.db.Delete(&models.History{}, "id = ?", id).Error
}

// DeleteByUserID removes all history for a user
func (r *HistoryRepository) DeleteByUserID(userID string) error {
	return r.db.Where("user_id = ?", userID).Delete(&models.History{}).Error
}