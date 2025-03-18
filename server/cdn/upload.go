package cdn

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"github.com/spf13/viper"
)

// UploadFile uploads a file to Azure Blob Storage and returns the URL
func UploadStream(file multipart.File, fileName string) (string, error) {
	// Ensure BlobClient is initialized
	if BlobClient == nil {
		log.Fatal("BlobClient is not initialized. Call InitBlobClient first.")
	}

	// Upload the file to a block blob
	_, err := BlobClient.UploadStream(context.TODO(), "images", fileName, file,
		&azblob.UploadStreamOptions{
			BlockSize:   int64(1024 * 1024), // 1MB blocks
			Concurrency: 3,
		})
	if err != nil {
		return "", fmt.Errorf("failed to upload file: %w", err)
	}
	AccountName := viper.GetString("AZURE_STORAGE_ACCOUNT_NAME")
	if AccountName == "" {
		AccountName = "fixmystreetstorage"
	}
	// Return the blob URL
	blobURL := fmt.Sprintf("https://%s.blob.core.windows.net/%s/%s", AccountName, "images", fileName)
	return blobURL, nil
}

func UploadFile(fileHandler *os.File, fileName string) {
	// Ensure the BlobClient is initialized
	if BlobClient == nil {
		log.Fatal("BlobClient is not initialized. Call InitBlobClient first.")
	}

	// Upload the file to a block blob
	_, err := BlobClient.UploadFile(context.TODO(), "images", fileName, fileHandler,
		&azblob.UploadFileOptions{
			BlockSize:   int64(1024),
			Concurrency: uint16(3),
			// If Progress is non-nil, this function is called periodically as bytes are uploaded.
			Progress: func(bytesTransferred int64) {
				fmt.Println(bytesTransferred)
			},
		})
	handleError(err)
}
