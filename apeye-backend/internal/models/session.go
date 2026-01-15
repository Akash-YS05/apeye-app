package models

import (
	"time"
	// "gorm.io/gorm"
)

// Session model for Better-Auth compatibility
// Better-Auth stores the session token in cookie and looks up by token field
type Session struct {
	ID        string    `gorm:"type:varchar(255);primary_key" json:"id"`
	UserID    string    `gorm:"type:varchar(255);not null;index;column:userId" json:"userId"`
	Token     string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"token"`
	ExpiresAt time.Time `gorm:"type:timestamp;not null;column:expiresAt" json:"expiresAt"`
	IPAddress *string   `gorm:"type:varchar(45);column:ipAddress" json:"ipAddress"`
	UserAgent *string   `gorm:"type:text;column:userAgent" json:"userAgent"`
	CreatedAt time.Time `gorm:"autoCreateTime;column:createdAt" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime;column:updatedAt" json:"updatedAt"`

	// Relationships
	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user,omitempty"`
}

func (Session) TableName() string {
	return "session"
}
