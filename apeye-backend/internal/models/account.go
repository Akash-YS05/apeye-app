package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Account for OAuth providers (Better-Auth compatible)
// Better-Auth expects specific column names: accountId, providerId, accessTokenExpiresAt, etc.
type Account struct {
	ID                    string     `gorm:"type:varchar(255);primary_key" json:"id"`
	UserID                string     `gorm:"type:varchar(255);not null;index;column:userId" json:"userId"`
	AccountID             string     `gorm:"type:varchar(255);not null;column:accountId" json:"accountId"`
	ProviderID            string     `gorm:"type:varchar(255);not null;column:providerId" json:"providerId"`
	AccessToken           *string    `gorm:"type:text;column:accessToken" json:"accessToken"`
	RefreshToken          *string    `gorm:"type:text;column:refreshToken" json:"refreshToken"`
	AccessTokenExpiresAt  *time.Time `gorm:"type:timestamp;column:accessTokenExpiresAt" json:"accessTokenExpiresAt"`
	RefreshTokenExpiresAt *time.Time `gorm:"type:timestamp;column:refreshTokenExpiresAt" json:"refreshTokenExpiresAt"`
	Scope                 *string    `gorm:"type:text" json:"scope"`
	IDToken               *string    `gorm:"type:text;column:idToken" json:"idToken"`
	Password              *string    `gorm:"type:varchar(255)" json:"password"`
	CreatedAt             time.Time  `gorm:"autoCreateTime;column:createdAt" json:"createdAt"`
	UpdatedAt             time.Time  `gorm:"autoUpdateTime;column:updatedAt" json:"updatedAt"`

	// Relationships
	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user,omitempty"`
}

func (a *Account) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	return nil
}

func (Account) TableName() string {
	return "account"
}
