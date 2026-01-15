package middleware

// import (
// 	"net/http"
// 	"strings"

// 	"github.com/gin-gonic/gin"
// 	"github.com/google/uuid"
// 	"github.com/Akash-YS05/apeye-app/apeye-backend/config"
// 	"github.com/Akash-YS05/apeye-app/apeye-backend/pkg/auth"
// )

// // middleware basically validates JWT token
// func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		authHeader := c.GetHeader("Authorization")
// 		if authHeader == "" {
// 			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
// 			c.Abort()
// 			return
// 		}

// 		parts := strings.SplitN(authHeader, " ", 2)
// 		if len(parts) != 2 || parts[0] != "Bearer" {
// 			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format. Use: Bearer <token>"})
// 			c.Abort()
// 			return
// 		}

// 		token := parts[1]

// 		claims, err := auth.ValidateToken(token, cfg.JWT.Secret)
// 		if err != nil {
// 			if err == auth.ErrExpiredToken {
// 				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has expired"})
// 			} else {
// 				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
// 			}
// 			c.Abort()
// 			return
// 		}

// 		c.Set("user_id", claims.UserID)
// 		c.Set("user_email", claims.Email)
// 		c.Set("user_plan", claims.Plan)

// 		c.Next()
// 	}
// }

// func GetUserID(c *gin.Context) (uuid.UUID, bool) {
// 	userID, exists := c.Get("user_id")
// 	if !exists {
// 		return uuid.Nil, false
// 	}
// 	id, ok := userID.(uuid.UUID)
// 	return id, ok
// }

// func GetUserEmail(c *gin.Context) (string, bool) {
// 	email, exists := c.Get("user_email")
// 	if !exists {
// 		return "", false
// 	}
// 	emailStr, ok := email.(string)
// 	return emailStr, ok
// }

// func GetUserPlan(c *gin.Context) (string, bool) {
// 	plan, exists := c.Get("user_plan")
// 	if !exists {
// 		return "", false
// 	}
// 	planStr, ok := plan.(string)
// 	return planStr, ok
// }