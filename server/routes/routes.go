package routes

import (
	"fixmystreet/controllers"
	"fixmystreet/middleware"

	"github.com/gin-gonic/gin"
)

func Router(r *gin.Engine) {
	auth := r.Group("/api/auth")
	{
		auth.GET("/whoami", controllers.WhoamiHandler)
		auth.POST("/login", controllers.LoginHandler)
		auth.POST("/signup", controllers.Signup)
		auth.GET("/users", controllers.GetAllUsers)

	}

	complaints := r.Group("/api/complaints")
	complaints.Use(middleware.Authenticator())

	{
		complaints.POST("/create", controllers.CreateComplaint)
		complaints.GET("/all", controllers.GetUserComplaints) // Get all user's complaint if user is not admin and if admin then get all complaints from all users
		complaints.GET("/complaint/:id", controllers.GetComplaint)
		complaints.PUT("/:id", controllers.UpdateComplaint)
		complaints.DELETE("/:id", controllers.DeleteComplaint)

	}
	admin := r.Group("/api/admin")
	admin.Use(middleware.Authenticator())
	{
		// admin.GET(("/stats"), controllers.GetStats)

	}
}
