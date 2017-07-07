package repositories

import (
	"github.com/gocms-io/gocms/models"
	"github.com/jmoiron/sqlx"
	"log"
)

type IPluginRepository interface {
	GetActivePlugins() ([]*models.PluginDatabaseRecord, error)
}

type PluginRepository struct {
	database *sqlx.DB
}

func DefaultPluginRepository(db interface{}) *PluginRepository {
	d, ok := db.(*sqlx.DB)
	if !ok {
		log.Fatalf("Plugin Repo expected *sqlx.DB but got %T.\n", db)
	}
	pluginRepository := &PluginRepository{
		database: d,
	}

	return pluginRepository
}

// get all events
func (pr *PluginRepository) GetActivePlugins() ([]*models.PluginDatabaseRecord, error) {
	var pluginRecords []*models.PluginDatabaseRecord
	err := pr.database.Select(&pluginRecords, `
	SELECT * from gocms_plugins WHERE isActive=?
	`, true)
	if err != nil {
		log.Printf("Error getting getting latest security code for user from database: %s", err.Error())
		return nil, err
	}
	return pluginRecords, nil
}
