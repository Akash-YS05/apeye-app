package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type HTTPMethod string

const (
	MethodGET     HTTPMethod = "GET"
	MethodPOST    HTTPMethod = "POST"
	MethodPUT     HTTPMethod = "PUT"
	MethodDELETE  HTTPMethod = "DELETE"
	MethodPATCH   HTTPMethod = "PATCH"
	MethodHEAD    HTTPMethod = "HEAD"
	MethodOPTIONS HTTPMethod = "OPTIONS"
)

type AuthType string

const (
	AuthNone   AuthType = "none"
	AuthBearer AuthType = "bearer"
	AuthBasic  AuthType = "basic"
	AuthAPIKey AuthType = "api-key"
)

type BodyType string

const (
	BodyNone       BodyType = "none"
	BodyJSON       BodyType = "json"
	BodyFormData   BodyType = "form-data"
	BodyURLEncoded BodyType = "x-www-form-urlencoded"
	BodyRaw        BodyType = "raw"
)

// JSONB type for PostgreSQL
type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	return json.Marshal(j)
}

func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = make(JSONB)
		return nil
	}
	
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	
	return json.Unmarshal(bytes, j)
}

type Request struct {
	ID           uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	CollectionID uuid.UUID  `gorm:"type:uuid;not null;index" json:"collection_id"`
	Name         string     `gorm:"type:varchar(255);not null" json:"name" binding:"required"`
	Method       HTTPMethod `gorm:"type:varchar(10);not null" json:"method" binding:"required"`
	URL          string     `gorm:"type:text;not null" json:"url" binding:"required"`
	Headers      JSONB      `gorm:"type:jsonb;default:'{}'" json:"headers"`
	Params       JSONB      `gorm:"type:jsonb;default:'{}'" json:"params"`
	Auth         JSONB      `gorm:"type:jsonb;default:'{}'" json:"auth"`
	Body         JSONB      `gorm:"type:jsonb;default:'{}'" json:"body"`
	CreatedAt    time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
	
	// Relationships
	Collection Collection `gorm:"foreignKey:CollectionID;constraint:OnDelete:CASCADE" json:"collection,omitempty"`
}

func (r *Request) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	// Initialize JSONB fields if nil
	if r.Headers == nil {
		r.Headers = make(JSONB)
	}
	if r.Params == nil {
		r.Params = make(JSONB)
	}
	if r.Auth == nil {
		r.Auth = make(JSONB)
	}
	if r.Body == nil {
		r.Body = make(JSONB)
	}
	return nil
}

func (Request) TableName() string {
	return "requests"
}