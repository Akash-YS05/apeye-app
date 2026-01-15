package services

import (
	"errors"
	"time"

	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/repository"
	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/auth"
)

var (
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUserNotFound       = errors.New("user not found")
)

type AuthService struct {
	userRepo *repository.UserRepository
	config   *config.Config
}

func NewAuthService(userRepo *repository.UserRepository, cfg *config.Config) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		config:   cfg,
	}
}

type RegisterInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	User         *UserResponse `json:"user"`
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	ExpiresIn    int64         `json:"expires_in"` // seconds
}

type UserResponse struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	Image     *string   `json:"image"`
	Plan      string    `json:"plan"`
	CreatedAt time.Time `json:"createdAt"`
}

// Register creates a new user account (legacy - Better-Auth handles this now)
func (s *AuthService) Register(input RegisterInput) (*AuthResponse, error) {

	exists, err := s.userRepo.EmailExists(input.Email)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, ErrEmailAlreadyExists
	}

	hashedPassword, err := auth.HashPassword(input.Password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email: input.Email,
		Plan:  models.PlanFree,
	}
	// Note: Better-Auth stores passwords in the account table, not user table
	_ = hashedPassword

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return s.generateAuthResponse(user)
}

func (s *AuthService) Login(input LoginInput) (*AuthResponse, error) {

	user, err := s.userRepo.FindByEmail(input.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrInvalidCredentials
	}

	// Note: Better-Auth stores passwords in the account table
	// This legacy endpoint may not work correctly with Better-Auth users

	return s.generateAuthResponse(user)
}

// GetUserByID returns user by ID (used by GetMe endpoint with Better-Auth sessions)
func (s *AuthService) GetUserByID(id string) (*UserResponse, error) {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}

	return &UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		Image:     user.Image,
		Plan:      string(user.Plan),
		CreatedAt: user.CreatedAt,
	}, nil
}

// RefreshToken generates new tokens from refresh token (legacy JWT-based)
func (s *AuthService) RefreshToken(refreshToken string) (*AuthResponse, error) {

	claims, err := auth.ValidateToken(refreshToken, s.config.JWT.Secret)
	if err != nil {
		return nil, err
	}

	user, err := s.userRepo.FindByID(claims.UserID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}

	return s.generateAuthResponse(user)
}

// generateAuthResponse creates auth response with tokens (legacy JWT-based)
func (s *AuthService) generateAuthResponse(user *models.User) (*AuthResponse, error) {

	accessToken, err := auth.GenerateToken(
		user.ID,
		user.Email,
		string(user.Plan),
		s.config.JWT.Secret,
		s.config.JWT.Expiry,
	)
	if err != nil {
		return nil, err
	}

	refreshToken, err := auth.GenerateToken(
		user.ID,
		user.Email,
		string(user.Plan),
		s.config.JWT.Secret,
		s.config.JWT.RefreshTokenExpiry,
	)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{
		User: &UserResponse{
			ID:        user.ID,
			Email:     user.Email,
			Name:      user.Name,
			Image:     user.Image,
			Plan:      string(user.Plan),
			CreatedAt: user.CreatedAt,
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(s.config.JWT.Expiry.Seconds()),
	}, nil
}
