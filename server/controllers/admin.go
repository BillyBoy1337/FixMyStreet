package controllers

import (
	"fixmystreet/database"
	"fixmystreet/models"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetStats(c *gin.Context) {
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

	// Get all complaints
	query := "SELECT * FROM c"
	complaints, err := database.GetComplaintsFromDB(userIDStr, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get complaints"})
		log.Printf("Failed to get complaints: %v", err)
		return
	}
	// fmt.Println(complaints[0])

	// Get all users

	users, err := database.GetAllUser()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		log.Printf("Failed to get users: %v", err)
		return
	}
	// fmt.Println(users)
	// Get all admins
	for _, user := range users {
		if user.Role == "admin" {
			// fmt.Println(user)
		}
	}
	GetStatsFromComplaints(complaints)
	GetComplaintsByMonth(complaints)
	GetComplaintsByCategory(complaints)
	GetComplaintsByVillage(complaints)

}

func GetStatsFromComplaints(complaints []models.Complaint) {
	// Get all complaints
	count := len(complaints)
	fmt.Printf("Total complaints: %d\n", count)
	// Group by Status and count
	// Pending , Resolved, In Progress, Closed, Reopened
	statusCount := make(map[string]int)
	for _, complaint := range complaints {
		statusCount[complaint.Status]++
	}
	fmt.Println(statusCount)
}

func GetComplaintsByMonth(complaints []models.Complaint) {
	// Group by Month and count
	monthCount := make(map[string]int)
	for _, complaint := range complaints {
		month := complaint.ReportedAt.Format("2006-01")
		monthCount[month]++
	}
	fmt.Println("Complaints by Month:", monthCount)
}

func GetComplaintsByCategory(complaints []models.Complaint) {
	// Group by Category and count
	categoryCount := make(map[string]int)
	for _, complaint := range complaints {
		categoryCount[complaint.Category]++
	}
	fmt.Println("Complaints by Category:", categoryCount)
}

func GetComplaintsByVillage(complaints []models.Complaint) {
	// Group by Village and count
	villageCount := make(map[string]int)
	for _, complaint := range complaints {
		villageCount[complaint.Village]++
	}
	fmt.Println("Complaints by Village:", villageCount)
}
