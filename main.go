package main

import (
	_ "github.com/joho/godotenv/autoload"
	"github.com/menklab/goCMS-BoilerPlate/database"
)

func main() {

	// init database
	database.Migrate()


}
