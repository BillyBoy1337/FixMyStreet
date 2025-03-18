package main

import (
	"fixmystreet/cdn"
	"fixmystreet/config"
	"fixmystreet/database"
	"fixmystreet/middleware"
	"fixmystreet/routes"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

const (
	readTimeout  = 5 * time.Second
	writeTimeout = 10 * time.Second
)

func handleError(err error) {
	if err != nil {
		log.Fatal(err.Error())
	}
}

func main() {
	fmt.Println("Starting FixMyStreet Server...")

	// Initialize the configuration
	config.InitConfig()

	// Initialize the BlobClient
	cdn.InitBlobClient()

	//Initialize the CosmosDB
	database.InitCosmoDB()

	PORT := viper.GetString("PORT")
	if PORT == "" {
		PORT = "8081"
	}
	// PORT := "8080"
	r := gin.New()
	r.Use(middleware.CORS())
	// r.Use(gin.CustomRecovery(recoveryHandler))
	r.Use(gin.Logger())

	routes.Router(r)

	server := &http.Server{
		Addr:         ":" + PORT,
		Handler:      r,
		ReadTimeout:  readTimeout,
		WriteTimeout: writeTimeout,
	}
	// Start the server
	fmt.Printf("Server running on port %s\n", PORT)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

}
