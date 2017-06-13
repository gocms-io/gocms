package repositories

import (
	"github.com/jmoiron/sqlx"
	"github.com/gocms-io/gocms-services/models"
	"log"
)

type ISettingsRepository interface {
	GetAll() (*[]models.Setting, error)
}

type SettingsRepository struct {
	database *sqlx.DB
}

func DefaultSettingsRepository(db interface{}) *SettingsRepository {
	d, ok := db.(*sqlx.DB)
	if !ok {
		log.Fatalf("Settings Repo expected *sqlx.DB but got %T.\n", db)
	}
	settingsRepository := &SettingsRepository{
		database: d,
	}

	return settingsRepository
}

// get all settings
func (ur *SettingsRepository) GetAll() (*[]models.Setting, error) {
	var settings []models.Setting
	err := ur.database.Select(&settings, "SELECT * FROM gocms_settings")
	if err != nil {
		log.Printf("Error getting settings from database: %s", err.Error())
		return nil, err
	}
	return &settings, nil
}
