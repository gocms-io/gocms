package health_service

import (
	"fmt"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/domain/health/health_model"
	"github.com/gocms-io/gocms/domain/plugin/plugin_services"
	"github.com/gocms-io/gocms/init/database"
	"github.com/gocms-io/gocms/utility/log"
	"github.com/gocms-io/gocms/utility/rest"
	"net/http"
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
	context.Schedule.AddTicker(10*time.Second, healthService.checkActivePluginHealth)

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
				// if health checks are not enabled we are good, and done!
				if !plugin.Manifest.Services.HealthCheck {
					healthService.health.Plugin[plugin.Manifest.Id] = true
					return
				}

				// otherwise we need make a health check request first
				healthUrl := fmt.Sprintf("%v://%v:%v/api/healthy", plugin.RoutesProxy.Schema, plugin.RoutesProxy.Host, plugin.RoutesProxy.Port)
				request := rest.Request{
					Url: healthUrl,
				}
				response, err := request.Get()
				if err != nil {
					log.Warningf("Error making plugin %v health request%v\n", plugin.Manifest.Id, err.Error())
					healthService.health.Plugin[plugin.Manifest.Id] = false

				} else if response.StatusCode != http.StatusOK {
					log.Warningf("Plugin %v health request came back bad %v\n", plugin.Manifest.Id, response.StatusCode)
					healthService.health.Plugin[plugin.Manifest.Id] = false
				} else {
					healthService.health.Plugin[plugin.Manifest.Id] = true
				}
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
