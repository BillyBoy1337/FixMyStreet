package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func EnsureAdmin() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		role := GetRole(ctx)

		if role != "admin" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		ctx.Next()
	}
}
