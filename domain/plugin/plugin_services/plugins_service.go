package plugin_services

import (
	"database/sql"
	"github.com/cqlcorp/gocms/domain/acl/access_control/access_control_service"
	"github.com/cqlcorp/gocms/domain/plugin/plugin_model"
	"github.com/cqlcorp/gocms/init/repository"
	"github.com/cqlcorp/gocms/routes"
	"github.com/cqlcorp/gocms/utility/log"
)

type IPluginsService interface {
	StartPluginsService() error
	RegisterActivePluginRoutes(routes *routes.Routes) error
	GetDatabasePlugins() (map[string]*plugin_model.PluginDatabaseRecord, error)
	RefreshInstalledPlugins() error
	GetActivePlugins() map[string]*plugin_model.Plugin
	NewPluginMiddlewareProxyByRank() *PluginMiddlewareProxyByRank
}


type PluginsService struct {
	repositoriesGroup *repository.RepositoriesGroup
	installedPlugins  map[string]*plugin_model.Plugin
	activePlugins     map[string]*plugin_model.Plugin
	aclService        access_control_service.IAclService
}

func DefaultPluginsService(rg *repository.RepositoriesGroup, aclService access_control_service.IAclService) *PluginsService {

	pluginsService := &PluginsService{
		repositoriesGroup: rg,
		installedPlugins:  make(map[string]*plugin_model.Plugin),
		activePlugins:     make(map[string]*plugin_model.Plugin),
		aclService:        aclService,
	}

	return pluginsService

}

func (ps *PluginsService) GetDatabasePlugins() (map[string]*plugin_model.PluginDatabaseRecord, error) {
	databasePluginRecords, err := ps.repositoriesGroup.PluginRepository.GetDatabasePlugins()
	if err != nil {
		if err == sql.ErrNoRows {
			log.Debugf("No plugins referenced in database.\n")
			return nil, err
		}
		log.Errorf("Error getting database plugins: %v\n", err.Error())
		return nil, err
	}

	databasePluginsMap := make(map[string]*plugin_model.PluginDatabaseRecord)
	for _, databasePlugin := range databasePluginRecords {
		databasePluginsMap[databasePlugin.PluginId] = databasePlugin
	}

	return databasePluginsMap, nil
}

func (ps *PluginsService) GetActivePlugins() map[string]*plugin_model.Plugin {
	return ps.activePlugins
}
