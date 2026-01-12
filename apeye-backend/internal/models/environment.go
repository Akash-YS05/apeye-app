package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Environment struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	WorkspaceID uuid.UUID `gorm:"type:uuid;not null;index" json:"workspace_id"`
	Name        string    `gorm:"type:varchar(255);not null" json:"name" binding:"required"`
	Variables   JSONB     `gorm:"type:jsonb;default:'{}'" json:"variables"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	
	// Relationships
	Workspace Workspace `gorm:"foreignKey:WorkspaceID;constraint:OnDelete:CASCADE" json:"workspace,omitempty"`
}

func (e *Environment) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	if e.Variables == nil {
		e.Variables = make(JSONB)
	}
	return nil
}

func (Environment) TableName() string {
	return "environments"
}