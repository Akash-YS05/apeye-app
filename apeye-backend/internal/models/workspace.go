package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Workspace struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID    string    `gorm:"type:varchar(255);not null;index;column:userId" json:"userId"`
	Name      string    `gorm:"type:varchar(255);not null" json:"name" binding:"required"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`

	// Relationships - User is managed by Better-Auth, use "-" to skip auto-migration
	User         User          `gorm:"foreignKey:UserID;references:ID;-" json:"user,omitempty"`
	Collections  []Collection  `gorm:"foreignKey:WorkspaceID;constraint:OnDelete:CASCADE" json:"collections,omitempty"`
	Environments []Environment `gorm:"foreignKey:WorkspaceID;constraint:OnDelete:CASCADE" json:"environments,omitempty"`
}

func (w *Workspace) BeforeCreate(tx *gorm.DB) error {
	if w.ID == uuid.Nil {
		w.ID = uuid.New()
	}
	return nil
}

func (Workspace) TableName() string {
	return "workspaces"
}
