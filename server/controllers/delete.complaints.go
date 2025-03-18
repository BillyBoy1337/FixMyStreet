package controllers

import (
	"context"
	"fixmystreet/database"
	"fmt"
	"log"
	"net/http"

	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
	"github.com/gin-gonic/gin"
)

func DeleteComplaint(c *gin.Context) {

	user, exists := c.Get("userID")
	if !exists {
		log.Println("Unauthorized")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	role := c.GetString("role")
	var req struct {
		UserId string `json:"userID"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to bind JSON"})
		return
	}
	fmt.Printf("Request: %v\n", req)
	complaintID := c.Param("id")

	fmt.Printf("Complaint ID: %v\n", complaintID)
	fmt.Printf("User ID: %v\n", req.UserId)
	fmt.Printf("User ID: %v\n", user)

	if role == "admin" {
		user = req.UserId
	}

	pk := azcosmos.NewPartitionKeyString(user.(string))

	// Delete the complaint using the ID and userID (partition key)

	item, err := database.DB.ComplaintClient.DeleteItem(context.TODO(), pk, complaintID, nil)
	if err != nil {
		log.Printf("Failed to delete complaint: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete complaint"})
		return
	}
	fmt.Printf("Deleted item: %v\n", item)

	fmt.Printf("Delete complaint handler called")
	c.JSON(http.StatusOK, gin.H{"message": "Complaint deleted successfully"})
}
