package main

import (
	_ "github.com/joho/godotenv/autoload"
	"bitbucket.org/menklab/grnow-services/database"
	"bitbucket.org/menklab/grnow-services/config"
	"bitbucket.org/menklab/grnow-services/controllers"
)

func main() {

	// migrate db
	database.Migrate()

	port := config.Port

	if port == "" {
		port = "8080"
	}

	// Start Server
	controllers.Listen(":" + port)
}

