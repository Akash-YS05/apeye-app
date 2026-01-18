package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
	"github.com/Akash-YS05/apeye-app/apeye-backend/internal/models"
	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/database"
	"github.com/gin-gonic/gin"
)

// SessionMiddleware validates Better-Auth session
func SessionMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var sessionToken string
		
		// Get raw cookie value from Cookie header
		cookieHeader := c.GetHeader("Cookie")
		if cookieHeader != "" {
			// Parse cookies manually to avoid URL decoding
			cookies := strings.Split(cookieHeader, "; ")
			for _, cookie := range cookies {
				parts := strings.SplitN(cookie, "=", 2)
				if len(parts) == 2 {
					if parts[0] == "better-auth.session_token" || parts[0] == "session_token" {
						sessionToken = parts[1]
						break
					}
				}
			}
		}
		
		// Try Authorization header as fallback
		if sessionToken == "" {
			authHeader := c.GetHeader("Authorization")
			if authHeader != "" {
				parts := strings.SplitN(authHeader, " ", 2)
				if len(parts) == 2 && parts[0] == "Bearer" {
					sessionToken = parts[1]
				}
			}
		}

		if sessionToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No session token provided"})
			c.Abort()
			return
		}

		// Better-Auth token format: {token}.{signature}
		// We only need the token part (before the dot)
		tokenParts := strings.Split(sessionToken, ".")
		if len(tokenParts) > 0 {
			sessionToken = tokenParts[0]
		}

		// Verify session in database using token field
		var session models.Session
		result := database.DB.Where("token = ?", sessionToken).First(&session)

		if result.Error != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid or expired session",
			})
			c.Abort()
			return
		}

		// Check if session is expired
		if session.ExpiresAt.Before(time.Now()) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Session expired"})
			c.Abort()
			return
		}

		// Get user details
		var user models.User
		if err := database.DB.First(&user, "id = ?", session.UserID).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		// Set user info in context
		c.Set("user_id", user.ID)
		c.Set("user_email", user.Email)
		c.Set("user_plan", user.Plan)
		c.Set("user_name", user.Name)

		c.Next()
	}
}

// GetUserID gets user ID from context (returns string for Better-Auth compatibility)
func GetUserID(c *gin.Context) (string, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return "", false
	}
	id, ok := userID.(string)
	return id, ok
}

// GetUserEmail gets user email from context
func GetUserEmail(c *gin.Context) (string, bool) {
	email, exists := c.Get("user_email")
	if !exists {
		return "", false
	}
	emailStr, ok := email.(string)
	return emailStr, ok
}

// GetUserPlan gets user plan from context
func GetUserPlan(c *gin.Context) (string, bool) {
	plan, exists := c.Get("user_plan")
	if !exists {
		return "", false
	}
	planStr, ok := plan.(string)
	return planStr, ok
}