package setting_repository

import (
	"github.com/myanrichal/gocms/domain/setting/setting_model"
	"github.com/jmoiron/sqlx"
	"github.com/myanrichal/gocms/utility/log"
)

type ISettingsRepository interface {
	GetAll() (*[]setting_model.Setting, error)
	GetByName(name string) (*setting_model.Setting, error)
	UpdateValueById(id int, value string) error
	UpdateValueByName(name string, value string) error
}

type SettingsRepository struct {
	database *sqlx.DB
}

func DefaultSettingsRepository(dbx *sqlx.DB) *SettingsRepository {
	settingsRepository := &SettingsRepository{
		database: dbx,
	}

	return settingsRepository
}

// get all settings
func (ur *SettingsRepository) GetAll() (*[]setting_model.Setting, error) {
	var settings []setting_model.Setting
	err := ur.database.Select(&settings, "SELECT * FROM gocms_settings")
	if err != nil {
		log.Errorf("Error getting settings from database: %s", err.Error())
		return nil, err
	}
	return &settings, nil
}

// get all settings
func (ur *SettingsRepository) GetByName(name string) (*setting_model.Setting, error) {
	var runtime setting_model.Setting
	err := ur.database.Get(&runtime, "SELECT * FROM gocms_settings WHERE name = ?", name)
	if err != nil {
		log.Errorf("Error getting runtime from database: %s", err.Error())
		return nil, err
	}
	return &runtime, nil
}

// get all settings
func (ur *SettingsRepository) UpdateValueById(id int, value string) error {
	_, err := ur.database.NamedExec("UPDATE gocms_settings SET value=:value WHERE id=:id", map[string]interface{}{"value": value, "id": id})
	if err != nil {
		log.Errorf("Error updating value of runtime from database: %s", err.Error())
		return err
	}
	return nil
}

// get all settings
func (ur *SettingsRepository) UpdateValueByName(name string, value string) error {
	_, err := ur.database.NamedExec("UPDATE gocms_settings SET value=:value WHERE name=:name", map[string]interface{}{"value": value, "name": name})
	if err != nil {
		log.Errorf("Error updating value of runtime from database: %s", err.Error())
		return err
	}
	return nil
}
