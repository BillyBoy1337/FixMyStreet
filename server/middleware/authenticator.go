package middleware

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func Authenticator() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authorizationHeader := ctx.GetHeader("authorization")
		if len(authorizationHeader) == 0 {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized,
				gin.H{"error": "authorization header is not provided"})
			return
		}

		fields := strings.Fields(authorizationHeader)
		if len(fields) < 2 {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized,
				gin.H{"error": "invalid authorization header format"})
			return
		}

		authorizationType := strings.ToLower(fields[0])
		if authorizationType != ("bearer") {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized,
				gin.H{"error": "bearer not found"})
			return
		}

		userID, role, err := validateToken(fields[1])
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized,
				gin.H{"error": "invalid token"})
			log.Println(err)
			return
		}

		// cookie, err := ctx.Request.Cookie("token")
		// if err != nil {
		// 	ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		// 	return
		// }

		// userID, roleID, err := validateToken(cookie.Value)
		// if err != nil {
		// 	ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid Cookies"})
		// 	return
		// }

		ctx.Set("userID", userID)
		ctx.Set("role", role)

		ctx.Next()
	}
}

func GetUserID(ctx *gin.Context) string {
	return ctx.GetString("userID")
}

func GetRole(ctx *gin.Context) string {
	return ctx.GetString("role")
}

func GetEmail(ctx *gin.Context) string {
	return ctx.GetString("email")
}
