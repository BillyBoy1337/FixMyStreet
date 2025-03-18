package controllers

import (
	"fixmystreet/database"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUserComplaints(c *gin.Context) {
	var userIDStr string
	var ok bool
	if role := c.GetString("role"); role != "admin" {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		userIDStr, ok = userID.(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user ID"})
			return
		}
	} else {
		userIDStr = ""
	}

	// pk := azcosmos.PartitionKey{}
	query := "SELECT * FROM c"
	complaints, err := database.GetComplaintsFromDB(userIDStr, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get complaints"})
		log.Printf("Failed to get complaints: %v", err)
		return
	}

	c.JSON(http.StatusOK, complaints)

}

func GetAllComplaints(c *gin.Context) {
	fmt.Printf("Get all complaints handler called")
}
func GetComplaint(c *gin.Context) {
	var userIDStr string
	var ok bool
	if role := c.GetString("role"); role != "admin" {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		userIDStr, ok = userID.(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user ID"})
			return
		}
	} else {
		userIDStr = ""
	}
	complaintID := c.Param("id")
	query := fmt.Sprintf("SELECT * FROM c WHERE c.id = '%s'", complaintID)
	// pk := azcosmos.PartitionKey{}
	complaints, err := database.GetComplaintsFromDB(userIDStr, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get complaints"})
		log.Printf("Failed to get complaints: %v", err)
		return
	}

	c.JSON(http.StatusOK, complaints)

}
