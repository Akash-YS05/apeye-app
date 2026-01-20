package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type History struct {
	ID           uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID       string     `gorm:"type:varchar(255);not null;index;column:userId" json:"userId"`
	Method       HTTPMethod `gorm:"type:varchar(10);not null" json:"method"`
	URL          string     `gorm:"type:text;not null" json:"url"`
	RequestData  JSONB      `gorm:"type:jsonb;default:'{}'" json:"requestData"`
	ResponseData JSONB      `gorm:"type:jsonb;default:'{}'" json:"responseData"`
	StatusCode   int        `gorm:"type:int" json:"statusCode"`
	ResponseTime int        `gorm:"type:int" json:"responseTime"`
	CreatedAt    time.Time  `gorm:"autoCreateTime;index" json:"createdAt"`

	// Relationships
	User User `gorm:"foreignKey:UserID;references:ID;-" json:"user,omitempty"`
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