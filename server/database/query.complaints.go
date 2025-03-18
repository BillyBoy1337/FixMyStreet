package database

import (
	"context"
	"encoding/json"
	"fixmystreet/models"
	"fmt"

	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
)

func (db *CosmosDB) CreateComplaint(partitionKeyValue string, item interface{}) error {
	itemData, err := json.Marshal(item)
	if err != nil {
		return fmt.Errorf("failed to marshal item data: %w", err)
	}

	// Step 4: Insert the item into the container
	partitionKey := azcosmos.NewPartitionKeyString(partitionKeyValue)
	_, err = DB.ComplaintClient.UpsertItem(context.TODO(), partitionKey, itemData, nil)
	if err != nil {
		return fmt.Errorf("failed to insert item: %w", err)
	}

	return nil
}

func GetComplaintsFromDB(partitionKeyValue string, query string) (result []models.Complaint, err error) {
	fmt.Print("GetUserComplaintsFromDB called")
	var pk azcosmos.PartitionKey
	if partitionKeyValue == "" {
		pk = azcosmos.PartitionKey{}
	} else {
		pk = azcosmos.NewPartitionKeyString(partitionKeyValue)
	}

	queryPager := DB.ComplaintClient.NewQueryItemsPager(query, pk, nil)

	complaints, err := extractItems[models.Complaint](queryPager)
	if err != nil {
		return nil, fmt.Errorf("failed to query items: %w", err)
	}
	// fmt.Print("Result", complaints)
	return complaints, nil
}
