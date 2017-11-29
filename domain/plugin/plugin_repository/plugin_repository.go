package plugin_repository

import (
	"github.com/jmoiron/sqlx"
	"github.com/gocms-io/gocms/domain/plugin/plugin_model"
	"github.com/gocms-io/gocms/utility/log"
)

type IPluginRepository interface {
	GetDatabasePlugins() ([]*plugin_model.PluginDatabaseRecord, error)
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
func (pr *PluginRepository) GetDatabasePlugins() ([]*plugin_model.PluginDatabaseRecord, error) {
	var pluginRecords []*plugin_model.PluginDatabaseRecord
	err := pr.database.Select(&pluginRecords, `
	SELECT * from gocms_plugins
	`)
	if err != nil {
		log.Errorf("Error getting getting latest security code for user from database: %s", err.Error())
		return nil, err
	}
	return pluginRecords, nil
}
