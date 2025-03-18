package database

import (
	"context"
	"encoding/json"
	"fixmystreet/models"
	"fmt"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/runtime"
	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
)

func GetUserByEmail(email string) (*models.User, error) {
	queryOptions := &azcosmos.QueryOptions{
		QueryParameters: []azcosmos.QueryParameter{
			{Name: "@email", Value: email},
		},
		PageSizeHint: 1, // Limits the query to return only 1 item
	}
	// pk := azcosmos.NewPartitionKeyString(email)
	pk := azcosmos.PartitionKey{}
	queryPager := DB.UserClient.NewQueryItemsPager("SELECT * FROM c WHERE c.email = @email", pk, queryOptions)
	// users, err := extractUser(queryPager)
	users, err := extractItems[models.User](queryPager)
	if err != nil {
		return nil, fmt.Errorf("failed to query items: %w", err)
	}
	if len(users) == 0 {
		return nil, nil
	}
	return &users[0], nil
}

func GetUser() ([]models.User, error) {
	containerName := "users"
	ctx := context.TODO()

	// Step 1: Get the container client
	// container, err := DB.DBClient.NewContainer(containerName)
	// if err != nil {
	// 	return nil, fmt.Errorf("failed to get container client: %w", err)
	// }

	// Step 2: Define the partition key (empty string for cross-partition queries)
	pk := azcosmos.NewPartitionKeyString("4")

	query := "SELECT * FROM c"
	// Step 3: Execute the query
	queryPager := DB.UserClient.NewQueryItemsPager(query, pk, nil)

	// Step 4: Collect results
	var users []models.User
	for queryPager.More() {
		queryResponse, err := queryPager.NextPage(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to query items: %w", err)
		}

		// Step 5: Unmarshal each item into a models.User struct
		for _, item := range queryResponse.Items {
			var user models.User
			err := json.Unmarshal(item, &user)
			if err != nil {
				return nil, fmt.Errorf("failed to unmarshal user: %w", err)
			}
			users = append(users, user)
		}
	}

	// Step 6: Return the results
	if len(users) == 0 {
		return nil, fmt.Errorf("no users found in container '%s'", containerName)
	}

	return users, nil
}

func GetAllUser() ([]models.User, error) {
	containerName := "users"

	// Step 1: Get the container client
	container, err := DB.DBClient.NewContainer(containerName)
	if err != nil {
		return nil, fmt.Errorf("failed to get container client: %w", err)
	}
	enableCrossPartition := true
	query := "SELECT * FROM c"
	queryPager := container.NewQueryItemsPager(query, azcosmos.PartitionKey{}, &azcosmos.QueryOptions{
		EnableCrossPartitionQuery: &enableCrossPartition,
	})

	users, err := extractUser(queryPager)
	if err != nil {
		return nil, fmt.Errorf("failed to query items: %w", err)
	}
	if len(users) == 0 {
		return nil, fmt.Errorf("no users found in container '%s'", containerName)
	}

	return users, nil
}

func InsertDummyUser(id string, email string) error {
	containerName := "users"

	// Create a dummy user
	user := models.User{
		Id:       id,
		Name:     "John Doe",
		Email:    email,
		Password: "password123",
	}

	// Insert the dummy user into the container

	err := DB.CreateUser(containerName, id, user)
	if err != nil {
		return fmt.Errorf("failed to insert dummy user: %w", err)
	}

	fmt.Println("Dummy user inserted successfully!")
	return nil
}

func extractUser(queryPager *runtime.Pager[azcosmos.QueryItemsResponse]) ([]models.User, error) {
	context := context.TODO()
	users := []models.User{}
	for queryPager.More() {
		queryResponse, err := queryPager.NextPage(context)
		if err != nil {
			return nil, fmt.Errorf("failed to query items: %w", err)
		}

		// Step 5: Unmarshal each item into a models.User struct
		for _, item := range queryResponse.Items {
			var user models.User
			err := json.Unmarshal(item, &user)
			if err != nil {
				return nil, fmt.Errorf("failed to unmarshal user: %w", err)
			}
			users = append(users, user)
		}
	}
	return users, nil
}

func extractItems[T any](queryPager *runtime.Pager[azcosmos.QueryItemsResponse]) ([]T, error) {
	ctx := context.TODO()
	var items []T
	for queryPager.More() {
		queryResponse, err := queryPager.NextPage(ctx)
		if err != nil {
			return nil, fmt.Errorf("failed to query items: %w", err)
		}

		for _, item := range queryResponse.Items {
			var obj T
			err := json.Unmarshal(item, &obj)
			if err != nil {
				return nil, fmt.Errorf("failed to unmarshal item: %w", err)
			}
			items = append(items, obj)
		}
	}
	return items, nil
}
