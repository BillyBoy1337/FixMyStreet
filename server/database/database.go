package database

import "fixmystreet/models"

// Database interface defines common methods for all databases
type Database interface {
	EnsureContainerExists(containerName string, partitionKey string) error
	InsertUser(containerName string, user models.User) error
	FindUserByEmail(containerName string, email string) (*models.User, error)
}
