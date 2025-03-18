package controllers

import (
	"fixmystreet/database"
	"fixmystreet/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func WhoamiHandler(ctx *gin.Context) {
	middleware.Authenticator()(ctx)
	user_id := middleware.GetUserID(ctx)
	role := middleware.GetRole(ctx)

	if user_id == "" {
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"role": role, "user_id": user_id})
}

func GetAllUsers(c *gin.Context) {

	// users, err := database.GetAllUsers("users")
	users, err := database.GetAllUser()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users", "err": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}

// func Login(c *gin.Context) {
// 	var user models.User
// 	if err := c.ShouldBindJSON(&user); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
// 		return
// 	}

// 	// Find the user in the database
// 	foundUser, err := database.DBClient.FindUserByEmail(user.Email)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
// 		return
// 	}

// 	// Check the password (this is a placeholder; use proper password hashing in production)
// 	if foundUser.Password != user.Password {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Login successful!", "user": foundUser})
// }
