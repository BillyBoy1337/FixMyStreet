package database

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
	"github.com/spf13/viper"
)

// CosmosDB represents the Cosmos DB client and database
type CosmosDB struct {
	Client          *azcosmos.Client
	DBClient        *azcosmos.DatabaseClient
	DatabaseName    string
	UserClient      *azcosmos.ContainerClient
	ComplaintClient *azcosmos.ContainerClient
}

var DB *CosmosDB

func handleError(err error) {
	if err != nil {
		log.Fatal(err.Error())
	}
}

// openConnection initializes the Cosmos DB client and database
func openConnection() error {
	accountName := viper.GetString("AZURE_COSMODB_ACCOUNT_NAME")
	// accountName, ok := "fixmystreett", true
	if accountName == "" {
		panic("AZURE_STORAGE_ACCOUNT_NAME could not be found")
	}
	serviceURL := fmt.Sprintf("https://%s.documents.azure.com:443/", accountName)
	primaryKey := viper.GetString("AZURE_COSMOSDB_PRIMARY_KEY")
	// databaseName := "fixmystreet"
	databaseName := viper.GetString("AZURE_COSMOSDB_DATABASE_NAME")
	if databaseName == "" {
		databaseName = "fixmystreet"
	}
	if primaryKey == "" {
		panic("AZURE_COSMOSDB_PRIMARY_KEY could not be found")
	}
	if accountName == "" {
		panic("AZURE_COSMOSDB_ACCOUNT_NAME could not be found")
	}

	// Create a new client
	cred, err := azcosmos.NewKeyCredential(primaryKey)
	if err != nil {
		return fmt.Errorf("failed to create credential: %w", err)
	}

	client, err := azcosmos.NewClientWithKey(serviceURL, cred, nil)
	if err != nil {
		return fmt.Errorf("failed to create client: %w", err)
	}

	// Check if the database exists, and create it if it doesn't
	database, err := client.NewDatabase(databaseName)
	if err != nil {
		return fmt.Errorf("failed to get database: %w", err)
	}

	throughput := azcosmos.NewManualThroughputProperties(1000) // Shared 1000 RU/s
	// Check if the database exists
	_, err = database.Read(context.TODO(), nil)
	if err != nil {
		// Database does not exist, create it with shared throughput

		_, err = client.CreateDatabase(context.TODO(), azcosmos.DatabaseProperties{ID: databaseName}, &azcosmos.CreateDatabaseOptions{
			ThroughputProperties: &throughput,
		})
		if err != nil {
			return fmt.Errorf("failed to create database: %w", err)
		}
		log.Println("Database created successfully with shared throughput!")
	} else {
		log.Println("Database already exists. Checking throughput settings...")

		// Ensure shared throughput is correctly set
		resp, err := database.ReadThroughput(context.TODO(), nil)
		if err != nil {
			// Check if it's a 404 (meaning no shared throughput is set)
			var respErr *azcore.ResponseError
			if errors.As(err, &respErr) && respErr.StatusCode == 404 {
				log.Println("No database-level throughput found. Containers must have dedicated RU/s.")
				return nil
			}
			return fmt.Errorf("failed to read database throughput: %w", err)
		}

		// Check if the database has shared throughput
		if resp.ThroughputProperties != nil {
			currentThroughput, ok := resp.ThroughputProperties.ManualThroughput()
			if ok && currentThroughput != 1000 {
				_, err = database.ReplaceThroughput(context.TODO(), throughput, nil)
				if err != nil {
					return fmt.Errorf("failed to update database throughput: %w", err)
				}
				log.Printf("Updated database throughput to %d RU/s", 1000)
			} else {
				log.Printf("Database already has %d RU/s shared throughput.", currentThroughput)
			}
		} else {
			log.Println("Database does not have shared throughput. Containers will need individual RU/s.")
		}
	}

	// Initialize the global DBClient
	DB = &CosmosDB{
		Client:       client,
		DBClient:     database,
		DatabaseName: databaseName,
	}

	return nil
}

func (db *CosmosDB) EnsureDatabaseThroughput(ru int32) error {
	throughput := azcosmos.NewManualThroughputProperties(ru)

	// Read existing database throughput
	_, err := db.DBClient.Read(context.TODO(), nil)
	if err != nil {
		return fmt.Errorf("failed to read database: %w", err)
	}
	log.Printf("Database %s already exists. Checking throughput settings...", db.DatabaseName)

	// Attempt to read database-level throughput
	resp, err := db.DBClient.ReadThroughput(context.TODO(), nil)
	if err != nil {
		// 🔹 Handle the case where the database has no shared throughput
		var respErr *azcore.ResponseError
		if errors.As(err, &respErr) && respErr.StatusCode == 404 {

			log.Println("No database-level throughput found. Skipping throughput update.")
			return nil
		}
		return fmt.Errorf("failed to read database throughput: %w", err)
	}

	// Handle case where no throughput is set at the database level
	if resp.ThroughputProperties == nil {
		log.Println("Database does not have shared throughput. Containers must have their own throughput.")
		return nil
	}

	// Get current throughput value
	currentThroughput, ok := resp.ThroughputProperties.ManualThroughput()
	if !ok {
		log.Println("Database is using autoscale throughput. Skipping manual throughput update.")
		return nil
	}

	// Update only if needed
	if currentThroughput != ru {
		_, err := db.DBClient.ReplaceThroughput(context.TODO(), throughput, nil)
		if err != nil {
			return fmt.Errorf("failed to update database throughput: %w", err)
		}
		log.Printf("Updated database throughput to %d RU/s", ru)
	} else {
		log.Printf("Database already has %d RU/s throughput. No update needed.", ru)
	}

	return nil
}

func InitCosmoDB() {
	err := openConnection()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Ensure DB is properly initialized
	if DB == nil || DB.Client == nil || DB.DBClient == nil {
		log.Fatal("Database connection was not initialized properly.")
	}

	// Try setting shared throughput
	err = DB.EnsureDatabaseThroughput(1000) // Set shared RU/s
	if err != nil {
		log.Printf("Warning: Could not set database throughput. Containers may need dedicated RU/s. Error: %v", err)
	}

	// Ensure containers exist
	err = DB.EnsureContainerExists("users", "/id")
	if err != nil {
		log.Fatalf("Failed to ensure users container exists: %v", err)
	}

	err = DB.EnsureContainerExists("complaints", "/userId")
	if err != nil {
		log.Fatalf("Failed to ensure complaints container exists: %v", err)
	}
	userContainer, err := DB.DBClient.NewContainer("users")
	if err != nil {
		log.Fatalf("failed to get container client: %w", err)
	}
	complaintContainer, err := DB.DBClient.NewContainer("complaints")
	if err != nil {
		log.Fatalf("failed to get container client: %w", err)
	}
	DB.UserClient = userContainer
	DB.ComplaintClient = complaintContainer
	fmt.Println("Database and containers are ready!")
}
