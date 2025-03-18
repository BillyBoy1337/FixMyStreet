package controllers

import (
	"context"
	"encoding/json"
	"fixmystreet/database"
	"log"
	"net/http"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
	"github.com/gin-gonic/gin"
)

func UpdateComplaint(c *gin.Context) {
	user, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	role := c.GetString("role")
	complaintID := c.Param("id")

	var pk azcosmos.PartitionKey
	var request struct {
		Title       string  `json:"title" binding:"required"`
		Category    string  `json:"category" binding:"required"`
		Description string  `json:"description" binding:"required"`
		Village     string  `json:"village" binding:"required"`
		Street      string  `json:"street" binding:"required"`
		Lat         float64 `json:"lat" binding:"required"`
		Lng         float64 `json:"lng" binding:"required"`
		Status      string  `json:"status"`
		UserID      string  `json:"userID"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "message": "Invalid request payload"})
		return
	}

	if role == "admin" {
		if request.UserID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required for admin updates"})
			return
		}
		pk = azcosmos.NewPartitionKeyString(request.UserID)
	} else {
		pk = azcosmos.NewPartitionKeyString(user.(string))
	}

	// Read the existing complaint
	item, err := database.DB.ComplaintClient.ReadItem(context.TODO(), pk, complaintID, nil)
	if err != nil {
		log.Printf("Failed to read complaint: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read complaint"})
		return
	}

	var itemContent map[string]interface{}
	err = json.Unmarshal(item.Value, &itemContent)
	if err != nil {
		log.Printf("Failed to unmarshal item: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unmarshal item"})
		return
	}

	// Update the complaint with the new data
	itemContent["title"] = request.Title
	itemContent["category"] = request.Category
	itemContent["description"] = request.Description
	itemContent["village"] = request.Village
	itemContent["street"] = request.Street
	itemContent["lat"] = request.Lat
	itemContent["lng"] = request.Lng

	// Only update the status if the user is an admin
	if role == "admin" {
		itemContent["status"] = request.Status
	}

	// Update the updatedAt field
	itemContent["updatedAt"] = time.Now().Format(time.RFC3339)

	// Marshal the updated complaint
	itemContentBytes, err := json.Marshal(itemContent)
	if err != nil {
		log.Printf("Failed to marshal item content: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal item content"})
		return
	}

	// Replace the complaint in the database
	_, err = database.DB.ComplaintClient.ReplaceItem(context.TODO(), pk, complaintID, itemContentBytes, nil)
	if err != nil {
		log.Printf("Failed to update complaint: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update complaint"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Complaint updated successfully"})
}
