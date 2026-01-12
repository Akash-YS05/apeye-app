package services

import (
	"errors"
	"time"

	"github.com/google/uuid"
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
	ID        uuid.UUID `json:"id"`
	Email     string    `json:"email"`
	Plan      string    `json:"plan"`
	CreatedAt time.Time `json:"created_at"`
}

//creates a new user account
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
		Email:        input.Email,
		PasswordHash: hashedPassword,
		Plan:         models.PlanFree,
	}

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

	if !auth.CheckPassword(input.Password, user.PasswordHash) {
		return nil, ErrInvalidCredentials
	}

	return s.generateAuthResponse(user)
}

//returns user by ID
func (s *AuthService) GetUserByID(id uuid.UUID) (*UserResponse, error) {
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
		Plan:      string(user.Plan),
		CreatedAt: user.CreatedAt,
	}, nil
}

//generates new tokens from refresh token
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

//creates auth response with tokens
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
			Plan:      string(user.Plan),
			CreatedAt: user.CreatedAt,
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(s.config.JWT.Expiry.Seconds()),
	}, nil
}