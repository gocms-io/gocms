package plugin_repository

import (
	"github.com/jmoiron/sqlx"
	"github.com/myanrichal/gocms/domain/plugin/plugin_model"
	"github.com/myanrichal/gocms/utility/log"
	"encoding/json"
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
		log.Errorf("Error getting getting database plugins from database: %s", err.Error())
		return nil, err
	}

	// parse manifest if it exists
	for _, pluginRecord := range pluginRecords {
		var manifest plugin_model.PluginManifest
		if pluginRecord.ManifestData.String != "" {
			err := json.Unmarshal([]byte(pluginRecord.ManifestData.String), &manifest)
			if err != nil {
				log.Errorf("Error getting plugin %v manifest: %v\n", pluginRecord.PluginId, err.Error())
			}
			pluginRecord.Manifest = &manifest
		}
	}

	return pluginRecords, nil
}
