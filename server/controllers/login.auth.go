package controllers

import (
	"fixmystreet/database"
	"fixmystreet/middleware"
	"fixmystreet/models"
	"fixmystreet/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}
	// Find the user in the database
	foundUser, err := database.GetUserByEmail(req.Email)
	if err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}
	// Check if foundUser is nil
	if foundUser == nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	// Check the password (this is a placeholder; use proper password hashing in production)
	if !utils.ComparePasswords(foundUser.Password, req.Password) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid Credentials"})
		return
	}
	token, err := middleware.GenerateToken(foundUser.Id, foundUser.Role, true)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var userResponse models.UserResponse
	userResponse.UserID = foundUser.Id
	userResponse.Email = foundUser.Email
	userResponse.Role = foundUser.Role
	userResponse.Name = foundUser.Name

	c.JSON(http.StatusOK, gin.H{"token": token, "user": userResponse})

}
