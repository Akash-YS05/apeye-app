package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type History struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID       uuid.UUID `gorm:"type:uuid;not null;index" json:"user_id"`
	Method       HTTPMethod `gorm:"type:varchar(10);not null" json:"method"`
	URL          string    `gorm:"type:text;not null" json:"url"`
	RequestData  JSONB     `gorm:"type:jsonb;default:'{}'" json:"request_data"`
	ResponseData JSONB     `gorm:"type:jsonb;default:'{}'" json:"response_data"`
	StatusCode   int       `gorm:"type:int" json:"status_code"`
	ResponseTime int       `gorm:"type:int" json:"response_time"`
	CreatedAt    time.Time `gorm:"autoCreateTime;index" json:"created_at"`
	
	// Relationships
	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user,omitempty"`
}

func (h *History) BeforeCreate(tx *gorm.DB) error {
	if h.ID == uuid.Nil {
		h.ID = uuid.New()
	}
	if h.RequestData == nil {
		h.RequestData = make(JSONB)
	}
	if h.ResponseData == nil {
		h.ResponseData = make(JSONB)
	}
	return nil
}

func (History) TableName() string {
	return "history"
}