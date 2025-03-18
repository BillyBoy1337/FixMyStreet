package controllers

import (
	"fixmystreet/database"
	"fixmystreet/models"
	"fixmystreet/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

func Signup(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Check if the user already exists
	existingUser, err := database.GetUserByEmail(req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user"})
		logrus.Errorf("Failed to get user: %v", err)
		return
	}
	if existingUser != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	// Hash the password
	hashedPassword := utils.HashAndSalt(req.Password)

	// Generate a UUID for the user ID
	userID := uuid.New().String()

	// Insert the user into the database
	user := models.User{
		Id:       userID,
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
		Role:     "user",
	}
	err = database.DB.CreateUser("users", user.Id, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		logrus.Errorf("Failed to create user: %v", err)
		return
	}

	logrus.Infof("User %s created successfully with id %s", user.Name, user.Id)
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully!"})
}
