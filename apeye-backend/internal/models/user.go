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

// User model - Better-Auth compatible
// Better-Auth expects: id, name, email, emailVerified, image, createdAt, updatedAt
// NOTE: This table is managed by Better-Auth, GORM should NOT auto-migrate it
type User struct {
	ID            string    `gorm:"type:varchar(255);primary_key" json:"id"`
	Email         string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	EmailVerified bool      `gorm:"type:boolean;default:false;column:emailVerified" json:"emailVerified"`
	Name          string    `gorm:"type:varchar(255)" json:"name"`
	Image         *string   `gorm:"type:text" json:"image"`
	Plan          PlanType  `gorm:"type:varchar(20);default:'free'" json:"plan"`
	CreatedAt     time.Time `gorm:"autoCreateTime;column:createdAt" json:"createdAt"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime;column:updatedAt" json:"updatedAt"`

	// Relationships - use gorm:"-" to prevent auto-migration of related tables
	Workspaces    []Workspace    `gorm:"-" json:"workspaces,omitempty"`
	Subscriptions []Subscription `gorm:"-" json:"subscriptions,omitempty"`
	History       []History      `gorm:"-" json:"history,omitempty"`
	Sessions      []Session      `gorm:"-" json:"sessions,omitempty"`
	Accounts      []Account      `gorm:"-" json:"accounts,omitempty"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}

func (User) TableName() string {
	return "user"
}
