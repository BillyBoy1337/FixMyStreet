package controllers

import (
	"fixmystreet/cdn"
	"fixmystreet/database"
	"fixmystreet/models"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateComplaint handles complaint submission along with an image upload
func CreateComplaint(c *gin.Context) {
	// Get user ID from JWT (Assuming middleware extracts it)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse Form Data
	var request struct {
		Title       string  `form:"title" binding:"required"`
		Category    string  `form:"category" binding:"required"`
		Description string  `form:"description" binding:"required"`
		Village     string  `form:"village" binding:"required"`
		Street      string  `form:"street" binding:"required"`
		Lat         float64 `form:"lat" binding:"required"`
		Lng         float64 `form:"lng" binding:"required"`
	}

	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get Image File
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image upload required"})
		return
	}
	defer file.Close()

	// Generate Unique Image Name
	imageName := fmt.Sprintf("complaints/%s-%s", uuid.New().String(), header.Filename)

	// Upload to Azure Blob Storage
	blobURL, err := cdn.UploadStream(file, imageName)
	if err != nil {
		log.Panicln("Azure Blob Upload Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
		return
	}

	// Create Complaint Object
	complaint := models.Complaint{
		ID:          userID.(string) + uuid.New().String(),
		Title:       request.Title,
		UserID:      userID.(string),
		Category:    request.Category,
		Description: request.Description,
		Location:    models.Location{Lat: request.Lat, Lng: request.Lng},
		ImageURL:    blobURL,
		Status:      "Pending",
		Village:     request.Village,
		Street:      request.Street,
		ReportedAt:  time.Now(),
		UpdatedAt:   time.Now(),
	}

	err = database.DB.CreateComplaint(complaint.UserID, complaint)
	if err != nil {
		log.Println("Failed to store complaint:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save complaint"})
		return
	}

	// Success Response
	c.JSON(http.StatusCreated, gin.H{
		"message": "Complaint submitted successfully",
		// "complaint": complaint,
	})
}
