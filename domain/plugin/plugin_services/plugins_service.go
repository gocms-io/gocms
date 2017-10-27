package plugin_services

import (
	"database/sql"
	"fmt"
	"github.com/gocms-io/gocms/models/runtime_models"
	"github.com/gocms-io/gocms/repositories"
	"github.com/gocms-io/gocms/routes"
)

type IPluginsService interface {
	StartActivePlugins() error
	RegisterActivePluginRoutes(routes *routes.Routes) error
	GetDatabasePlugins() (map[string]*runtime_models.PluginDatabaseRecord, error)
	RefreshInstalledPlugins() error
	GetActivePlugins() map[string]*runtime_models.Plugin
}

type PluginsService struct {
	repositoriesGroup *repositories.RepositoriesGroup
	installedPlugins  map[string]*runtime_models.Plugin
	activePlugins     map[string]*runtime_models.Plugin
}

func DefaultPluginsService(rg *repositories.RepositoriesGroup) *PluginsService {

	pluginsService := &PluginsService{
		repositoriesGroup: rg,
		installedPlugins:  make(map[string]*runtime_models.Plugin),
		activePlugins:     make(map[string]*runtime_models.Plugin),
	}

	return pluginsService

}

func (ps *PluginsService) GetDatabasePlugins() (map[string]*runtime_models.PluginDatabaseRecord, error) {
	databasePluginRecords, err := ps.repositoriesGroup.PluginRepository.GetDatabasePlugins()
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Printf("No plugins referenced in database.\n")
			return nil, err
		}
		fmt.Printf("Error getting database plugins: %v\n", err.Error())
		return nil, err
	}

	databasePluginsMap := make(map[string]*runtime_models.PluginDatabaseRecord)
	for _, databasePlugin := range databasePluginRecords {
		databasePluginsMap[databasePlugin.PluginId] = databasePlugin
	}

	return databasePluginsMap, nil
}

func (ps *PluginsService) GetActivePlugins() map[string]*runtime_models.Plugin {
	return ps.activePlugins
}
