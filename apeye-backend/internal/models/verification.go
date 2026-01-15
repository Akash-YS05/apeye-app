package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Verification model for Better-Auth
// Used for email verification, password reset tokens, etc.
type Verification struct {
	ID         string    `gorm:"type:varchar(255);primary_key" json:"id"`
	Identifier string    `gorm:"type:varchar(255);not null" json:"identifier"`
	Value      string    `gorm:"type:text;not null" json:"value"`
	ExpiresAt  time.Time `gorm:"type:timestamp;not null;column:expiresAt" json:"expiresAt"`
	CreatedAt  time.Time `gorm:"autoCreateTime;column:createdAt" json:"createdAt"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime;column:updatedAt" json:"updatedAt"`
}

func (v *Verification) BeforeCreate(tx *gorm.DB) error {
	if v.ID == "" {
		v.ID = uuid.New().String()
	}
	return nil
}

func (Verification) TableName() string {
	return "verification"
}
