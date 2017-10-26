package plugin_repository

import (
	"github.com/gocms-io/gocms/models/runtime_models"
	"github.com/jmoiron/sqlx"
	"log"
)

type IPluginRepository interface {
	GetDatabasePlugins() ([]*runtime_models.PluginDatabaseRecord, error)
}

type PluginRepository struct {
	database *sqlx.DB
}

func DefaultPluginRepository(dbx *sqlx.DB) *PluginRepository {
	pluginRepository := &PluginRepository{
		database: dbx,
	}

	return pluginRepository
}

// get all events
func (pr *PluginRepository) GetDatabasePlugins() ([]*runtime_models.PluginDatabaseRecord, error) {
	var pluginRecords []*runtime_models.PluginDatabaseRecord
	err := pr.database.Select(&pluginRecords, `
	SELECT * from gocms_plugins
	`)
	if err != nil {
		log.Printf("Error getting getting latest security code for user from database: %s", err.Error())
		return nil, err
	}
	return pluginRecords, nil
}
