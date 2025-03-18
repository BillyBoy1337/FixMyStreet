package database

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
)

// EnsureContainerExists ensures a container exists without setting RU/s (inherits from database)
func (db *CosmosDB) EnsureContainerExists(containerName, partitionKey string) error {
	props := azcosmos.ContainerProperties{
		ID: containerName,
		PartitionKeyDefinition: azcosmos.PartitionKeyDefinition{
			Paths: []string{partitionKey},
		},
	}

	// Create container with no explicit throughput (it will use the database's shared RU/s)
	_, err := db.DBClient.CreateContainer(context.TODO(), props, nil)
	if err != nil {
		var respErr *azcore.ResponseError
		if errors.As(err, &respErr) && respErr.StatusCode == 409 {
			log.Printf("Container %s already exists.", containerName)
			return nil
		}
		return fmt.Errorf("failed to create container %s: %w", containerName, err)
	}

	log.Printf("Container %s created successfully.", containerName)
	return nil
}

func (db *CosmosDB) CreateUser(containerName string, partitionKeyValue string, item interface{}) error {
	itemData, err := json.Marshal(item)
	if err != nil {
		return fmt.Errorf("failed to marshal item data: %w", err)
	}

	// Step 4: Insert the item into the container
	partitionKey := azcosmos.NewPartitionKeyString(partitionKeyValue)
	_, err = DB.UserClient.UpsertItem(context.TODO(), partitionKey, itemData, nil)
	if err != nil {
		return fmt.Errorf("failed to insert item: %w", err)
	}

	return nil
}

func (db *CosmosDB) QueryItems(containerName string, partitionKeyValue string, query string, parameters []azcosmos.QueryParameter, result interface{}) error {
	// Step 1: Get the container client
	container, err := db.DBClient.NewContainer(containerName)
	if err != nil {
		return fmt.Errorf("failed to get container client: %w", err)
	}

	// Step 2: Execute the query
	partitionKey := azcosmos.NewPartitionKeyString(partitionKeyValue)

	// Create QueryOptions with parameters
	queryOptions := &azcosmos.QueryOptions{
		QueryParameters: parameters,
	}

	iterator := container.NewQueryItemsPager(query, partitionKey, queryOptions)

	// Step 3: Collect results
	var items []json.RawMessage
	for iterator.More() {
		response, err := iterator.NextPage(context.TODO())
		if err != nil {
			return fmt.Errorf("failed to execute query: %w", err)
		}

		// Read the raw response body
		body, err := io.ReadAll(response.RawResponse.Body)
		if err != nil {
			return fmt.Errorf("failed to read response body: %w", err)
		}

		// Log the raw response for debugging
		log.Printf("Raw query response: %s\n", string(body))

		// Convert each []byte item to json.RawMessage
		for _, item := range response.Items {
			items = append(items, json.RawMessage(item))
		}
	}

	// Step 4: Unmarshal results into the provided struct
	if len(items) > 0 {
		// Combine all items into a single JSON array
		combinedItems := []byte("[" + string(items[0]) + "]")
		for _, item := range items[1:] {
			combinedItems = append(combinedItems, ',')
			combinedItems = append(combinedItems, item...)
		}
		combinedItems = append(combinedItems, ']')

		// Log the combined JSON array for debugging
		log.Printf("Combined JSON array: %s\n", string(combinedItems))

		// Unmarshal the combined JSON array into the result
		err = json.Unmarshal(combinedItems, result)
		if err != nil {
			return fmt.Errorf("failed to unmarshal query results: %w", err)
		}
	}

	return nil
}
