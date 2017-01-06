package repositories

import (
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/database"
	"github.com/jmoiron/sqlx"
	"log"
)

type ISettingsRepository interface {
	GetAll()(*[]models.Setting, error)
}

type SettingsRepository struct {
	database *sqlx.DB
}

func DefaultSettingsRepository(db *database.Database) *SettingsRepository {
	settingsRepository := &SettingsRepository{
		database: db.Dbx,
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
