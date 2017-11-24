package health_service

import (
	"fmt"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/domain/health/health_model"
	"github.com/gocms-io/gocms/domain/plugin/plugin_services"
	"github.com/gocms-io/gocms/init/database"
	"github.com/gocms-io/gocms/utility/log"
	"time"
)

type IHealthService interface {
	GetHealthStatus() (ok bool, context []string)
}

type HealthService struct {
	db            *database.Database
	pluginService plugin_services.IPluginsService
	health        *health_model.HealthMonitor
}

func DefaultHealthService(db *database.Database, pluginService plugin_services.IPluginsService) *HealthService {

	healthService := &HealthService{
		db:            db,
		pluginService: pluginService,
		// default good until bad
		health: &health_model.HealthMonitor{
			Database: true,
			Plugin:   make(map[string]bool),
		},
	}

	// add health checks
	context.Schedule.AddTicker(15*time.Second, healthService.checkDatabaseHealth)
	context.Schedule.AddTicker(60*time.Second, healthService.checkActivePluginHealth)

	return healthService

}

func (healthService *HealthService) GetHealthStatus() (ok bool, context []string) {
	// set ok until something is wrong
	ok = true

	// if database is not healthy
	if !healthService.health.Database {
		ok = false
		context = append(context, "Database connection lost")
	}

	// check plugins status
	for pluginId, isRunning := range healthService.health.Plugin {
		if !isRunning {
			ok = false
			context = append(context, fmt.Sprintf("Plugin %v, failed to start or is no longer running", pluginId))
		}
	}

	return ok, context

}

func (healthService *HealthService) checkActivePluginHealth() {
	go func() {
		for _, plugin := range healthService.pluginService.GetActivePlugins() {
			if !plugin.Running {
				log.Errorf("[Health Service] - Plugin %v, failed to start or is no longer running\n", plugin.Manifest.Id)
				healthService.health.Plugin[plugin.Manifest.Id] = false
			} else {
				// todo make a request to plugin /healthy to get report
				healthService.health.Plugin[plugin.Manifest.Id] = true
			}
		}
	}()
}

func (healthService *HealthService) checkDatabaseHealth() {
	go func() {
		//log.Debugf("[Health Service] - ping database for active connection\n")
		// check for database connectivity
		err := healthService.db.SQL.Dbx.Ping()
		if err != nil { // no connectivity
			log.Errorf("[Health Service] - Database connection lost: %v\n", err.Error())
			healthService.health.Database = false
		} else { // good connectivity
			healthService.health.Database = true
		}
	}()
}
