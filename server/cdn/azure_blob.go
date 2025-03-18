package cdn

import (
	"fmt"
	"log"

	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"github.com/spf13/viper"
)

var BlobClient *azblob.Client

func handleError(err error) {
	if err != nil {
		log.Fatal(err.Error())
	}
}

func InitBlobClient() {
	// accountName := viper.GetString("AZURE_STORAGE_ACCOUNT_NAME")
	// accountKey := viper.GetString("AZURE_STORAGE_ACCOUNT_KEY")
	cString := viper.GetString("AZURE_STORAGE_CONNECTION_STRING")
	// if accountName == "" {
	// 	panic("AZURE_STORAGE_ACCOUNT_NAME could not be found")
	// }
	// if accountKey == "" {
	// 	panic("AZURE_STORAGE_ACCOUNT_KEY could not be found")
	// }

	// serviceURL := fmt.Sprintf("https://%s.blob.core.windows.net/", accountName)

	// cred, err := azblob.NewSharedKeyCredential(accountName, accountKey)
	// handleError(err)

	client, err := azblob.NewClientFromConnectionString(cString, nil)
	handleError(err)
	fmt.Println("Blob client initialized successfully!")

	BlobClient = client
}
