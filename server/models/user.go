package models

import "time"

// User struct represents a document in the "users" container
type User struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"` // "user" or "admin"
}

type Location struct {
	Lat float64 `json:"lat" bson:"lat"`
	Lng float64 `json:"lng" bson:"lng"`
}

type Complaint struct {
	ID          string    `json:"id" bson:"_id,omitempty"`
	Title       string    `json:"title" bson:"title"`
	UserID      string    `json:"userId" bson:"userId"`
	Category    string    `json:"category" bson:"category"` // pothole, garbage, streetlight
	Description string    `json:"description" bson:"description"`
	Location    Location  `json:"location" bson:"location"`
	ImageURL    string    `json:"imageUrl" bson:"imageUrl"`
	Status      string    `json:"status" bson:"status"` // pending, in-progress, resolved
	Village     string    `json:"village" bson:"village"`
	Street      string    `json:"street" bson:"street"`
	ReportedAt  time.Time `json:"reportedAt" bson:"reportedAt"`
	UpdatedAt   time.Time `json:"updatedAt" bson:"updatedAt"`
}

type ComplaintUpdate struct {
	ID          string    `json:"id" bson:"_id,omitempty"`
	ComplaintID string    `json:"complaintId" bson:"complaintId"`
	AdminID     string    `json:"adminId" bson:"adminId"`
	Status      string    `json:"status" bson:"status"` // in-progress, resolved
	Comment     string    `json:"comment" bson:"comment"`
	UpdatedAt   time.Time `json:"updatedAt" bson:"updatedAt"`
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"` // "user" or "admin"
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserResponse struct {
	Role   string `json:"role"`
	Email  string `json:"email"`
	Name   string `json:"name"`
	UserID string `json:"userId"`
}

type file struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}
