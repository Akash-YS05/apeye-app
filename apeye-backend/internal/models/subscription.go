package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SubscriptionStatus string

const (
	SubscriptionActive   SubscriptionStatus = "active"
	SubscriptionCanceled SubscriptionStatus = "canceled"
	SubscriptionExpired  SubscriptionStatus = "expired"
	SubscriptionPending  SubscriptionStatus = "pending"
)

type Subscription struct {
	ID                     uuid.UUID          `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID                 uuid.UUID          `gorm:"type:uuid;not null;index" json:"user_id"`
	Plan                   PlanType           `gorm:"type:varchar(20);not null" json:"plan"`
	Status                 SubscriptionStatus `gorm:"type:varchar(20);not null" json:"status"`
	DodoSubscriptionID     string             `gorm:"type:varchar(255);uniqueIndex" json:"dodo_subscription_id"`
	DodoCustomerID         string             `gorm:"type:varchar(255)" json:"dodo_customer_id"`
	CurrentPeriodStart     time.Time          `gorm:"type:timestamp" json:"current_period_start"`
	CurrentPeriodEnd       time.Time          `gorm:"type:timestamp" json:"current_period_end"`
	CanceledAt             *time.Time         `gorm:"type:timestamp" json:"canceled_at"`
	CreatedAt              time.Time          `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt              time.Time          `gorm:"autoUpdateTime" json:"updated_at"`
	
	// Relationships
	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user,omitempty"`
}

func (s *Subscription) BeforeCreate(tx *gorm.DB) error {
	if s.ID == uuid.Nil {
		s.ID = uuid.New()
	}
	return nil
}

func (Subscription) TableName() string {
	return "subscriptions"
}