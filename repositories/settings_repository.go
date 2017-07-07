package repositories

import (
	"github.com/jmoiron/sqlx"
	"log"
	"github.com/gocms-io/gocms/models/runtime_models"
)

type ISettingsRepository interface {
	GetAll() (*[]runtime_models.Setting, error)
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
func (ur *SettingsRepository) GetAll() (*[]runtime_models.Setting, error) {
	var settings []runtime_models.Setting
	err := ur.database.Select(&settings, "SELECT * FROM gocms_settings")
	if err != nil {
		log.Printf("Error getting settings from database: %s", err.Error())
		return nil, err
	}
	return &settings, nil
}
