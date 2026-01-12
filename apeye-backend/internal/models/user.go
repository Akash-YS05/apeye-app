package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PlanType string

const (
	PlanFree PlanType = "free"
	PlanPro  PlanType = "pro"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Email        string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email" binding:"required,email"`
	PasswordHash string    `gorm:"type:varchar(255);not null" json:"-"`
	Plan         PlanType  `gorm:"type:varchar(20);default:'free'" json:"plan"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
	
	// Relationships
	Workspaces    []Workspace    `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"workspaces,omitempty"`
	Subscriptions []Subscription `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"subscriptions,omitempty"`
	History       []History      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"history,omitempty"`
}

//hook to generate UUID
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

//TableName specifies the table name
func (User) TableName() string {
	return "users"
}