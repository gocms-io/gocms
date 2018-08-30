package plugin_services

import (
	"bufio"
	"fmt"
	"github.com/cqlcorp/gocms/context"
	"github.com/cqlcorp/gocms/domain/plugin/plugin_model"
	"github.com/cqlcorp/gocms/utility"
	"github.com/cqlcorp/gocms/utility/log"
	"os"
	"os/exec"
	"path/filepath"
	"github.com/cqlcorp/gocms/domain/plugin/plugin_proxies/plugin_routes_proxy"
	"github.com/cqlcorp/gocms/domain/plugin/plugin_proxies/plugin_middleware_proxy"
	"github.com/cqlcorp/gocms/utility/errors"
)

func (ps *PluginsService) StartPluginsService() (err error) {

	// get plugins that are both active in the database and installed on disk
	activePlugins, err := ps.getActivePlugins()
	if err != nil {
		log.Errorf("No plugins to start due to error\n.")
		return err
	}

	for _, plugin := range activePlugins {
		// handle external plugins
		if plugin.IsExternal {
			newErr := ps.registerExternalPlugin(plugin)
			if newErr != nil {
				log.Errorf("Error routing to external plugin %v: %v\n", plugin.Manifest.Id, err.Error())
				err = newErr
			}

		} else { // handle local plugins
			newErr := ps.startLocalPlugin(plugin)
			if newErr != nil {
				log.Errorf("Error starting plugin %v: %v\n", plugin.Manifest.Id, err.Error())
				err = newErr
			}
		}
	}

	return err

}

func (ps *PluginsService) registerExternalPlugin(plugin *plugin_model.Plugin) error {
	// create proxy for use during registration

	// check for errors
	if plugin.ExternalPort.Int64 == 0 {
		log.Errorf("Plugin %v has nil port\n")
		return errors.New("plugin has a nil port")
	}
	if plugin.ExternalHost.String == "" {
		log.Errorf("Plugin %v has nil host\n")
		return errors.New("plugin has a nil host")
	}
	if plugin.ExternalSchema.String == "" {
		log.Errorf("Plugin %v has nil schema\n")
		return errors.New("plugin has a nil schema")
	}

	plugin.RoutesProxy = &plugin_routes_proxy.PluginRoutesProxy{
		Port:     int(plugin.ExternalPort.Int64),
		Schema:   plugin.ExternalSchema.String,
		Host:     plugin.ExternalHost.String,
		PluginId: plugin.Manifest.Id,
		Disabled: false,
	}

	// create proxies for middleware use
	for _, middleware := range plugin.Manifest.Services.Middleware {
		middleProxy := plugin_middleware_proxy.PluginMiddlewareProxy{
			ExecutionRank:    middleware.ExecutionRank,
			CopyBody:         middleware.CopyBody,
			HeadersToReceive: middleware.HeadersToReceive,
			PassAlongError:   middleware.PassAlongError,
			ContinueOnError:  middleware.ContinueOnError,
			PluginId:         plugin.Manifest.Id,
			Port:             int(plugin.ExternalPort.Int64),
			Schema:           plugin.ExternalSchema.String,
			Host:             plugin.ExternalHost.String,
			Disabled:         false,
		}

		// add middleware to slice
		plugin.MiddlewareProxies = append(plugin.MiddlewareProxies, &middleProxy)

	}

	log.Infof("Microservice External: %v\n", plugin.Manifest.Id)

	// add plugin to active list for monitoring and other things
	ps.activePlugins[plugin.Manifest.Id] = plugin

	return nil
}

func (ps *PluginsService) startLocalPlugin(plugin *plugin_model.Plugin) error {

	// find port to run on
	pluginPort, err := utility.FindPort()
	if err != nil {
		log.Errorf("Couldn't start plugin %v, error: %v", plugin.Manifest.Name, err.Error())
		return err
	}

	// build command
	cmd := exec.Command(filepath.FromSlash("./"+plugin.BinaryFile), fmt.Sprintf("-port=%d", pluginPort))
	cmd.Dir = plugin.PluginRoot

	// set stdout to pipe
	cmdStdoutReader, err := cmd.StdoutPipe()
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error creating StdoutPipe for Cmd", err)
		return err
	}

	// setup stdout to scan continuously
	stdOutScanner := bufio.NewScanner(cmdStdoutReader)
	go func() {
		for stdOutScanner.Scan() {
			fmt.Printf("\t > %s - %s\n", plugin.Manifest.Name, stdOutScanner.Text())
		}
	}()

	// set stderr to pipe
	cmdStderrReader, err := cmd.StderrPipe()
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error creating StdoutPipe for Cmd", err)
		return err
	}

	// setup stderr to scan continuously
	stdErrScanner := bufio.NewScanner(cmdStderrReader)
	go func() {
		for stdErrScanner.Scan() {
			fmt.Printf("\t > %s - %s\n", plugin.Manifest.Name, stdErrScanner.Text())
		}
	}()

	started := make(chan error)
	done := make(chan error)
	newPpmRouteChan := make(chan *plugin_routes_proxy.PluginRoutesProxy)              // this channel is used to update the port if plugin is restarted
	newPpmMiddlewareChan := make(chan *plugin_middleware_proxy.PluginMiddlewareProxy) // this channel is used to update the port if plugin is restarted

	// find port and start microservice
	log.Infof("Microservice Starting: %v\n", plugin.Manifest.Id)

	// kick off the command in a none blocking way
	go func() {
		started <- cmd.Start()
		done <- cmd.Wait()
	}()

	// check to see if there is an error starting plugin
	err = <-started
	if err != nil {
		log.Errorf("Error starting plugin %v: %v", plugin.Manifest.Name, err)
		return err
	} else {
		// no error
		plugin.Running = true
	}

	// add handle to command
	plugin.Cmd = cmd

	// do plugin proxies

	// create proxy for use during registration
	plugin.RoutesProxy = &plugin_routes_proxy.PluginRoutesProxy{
		Port:            pluginPort,
		Schema:          "http",
		Host:            "localhost",
		PluginId:        plugin.Manifest.Id,
		UpdateProxyChan: newPpmRouteChan,
		Disabled:        false,
	}

	// create proxies for middleware use
	for _, middleware := range plugin.Manifest.Services.Middleware {
		middleProxy := plugin_middleware_proxy.PluginMiddlewareProxy{
			UpdateProxyChan:  newPpmMiddlewareChan,
			ExecutionRank:    middleware.ExecutionRank,
			CopyBody:         middleware.CopyBody,
			HeadersToReceive: middleware.HeadersToReceive,
			PassAlongError:   middleware.PassAlongError,
			ContinueOnError:  middleware.ContinueOnError,
			PluginId:         plugin.Manifest.Id,
			Port:             pluginPort,
			Host:             "localhost",
			Schema:           "http",
			Disabled:         false,
		}

		// add middleware to slice
		plugin.MiddlewareProxies = append(plugin.MiddlewareProxies, &middleProxy)
	}

	// add plugin to active list for monitoring and other things
	ps.activePlugins[plugin.Manifest.Id] = plugin

	go func() {
		err := <-done
		plugin.Running = false
		if err != nil {
			log.Errorf("Microservice, %v, stopped unexpectedly: %v\n", plugin.Manifest.Id, err.Error())
			// do not restart plugins in dev mode
			if !context.Config.EnvVars.DevMode {
				log.Infof("Attempting to restart %v...\n", plugin.Manifest.Id)
				err = ps.startLocalPlugin(plugin)
			}
			if err != nil {
				plugin.RoutesProxy.Disabled = true
				newPpmRouteChan <- plugin.RoutesProxy
				log.Errorf("Microservice, %v, failed to restart: %v\n", plugin.Manifest.Id, err.Error())
			} else {
				newPpmRouteChan <- plugin.RoutesProxy
				log.Infof("Hot swapped new plugin. Running on port %v\n", plugin.RoutesProxy.Port)
			}
		} else {
			// no error it just quit
			log.Infof("Microservice, %v, stopped\n", plugin.Manifest.Id)
		}
	}()

	return nil
}

func (ps *PluginsService) getActivePlugins() (map[string]*plugin_model.Plugin, error) {

	// get plugins listed in database
	databasePlugins, err := ps.GetDatabasePlugins()
	if err != nil {
		log.Errorf("Couldn't get plugins to start: %v\n", err)
		return nil, err
	}

	pluginsToStart := make(map[string]*plugin_model.Plugin)

	// loop through database plugins
	for dbPluginId, dbPlugin := range databasePlugins {
		if dbPlugin.IsActive {
			// if plugin is installed and not flagged as external
			if ps.installedPlugins[dbPluginId] != nil && !dbPlugin.IsExternal {
				pluginsToStart[dbPluginId] = ps.installedPlugins[dbPluginId]
			} else if dbPlugin.IsExternal { // if external plugin
				// add external info
				pluginsToStart[dbPluginId] = &plugin_model.Plugin{
					Manifest:       dbPlugin.Manifest,
					IsExternal:     dbPlugin.IsExternal,
					ExternalSchema: dbPlugin.ExternalSchema,
					ExternalHost:   dbPlugin.ExternalHost,
					ExternalPort:   dbPlugin.ExternalPort,
				}
			} else { // plugin is not installed locally, but it is active in the database, and its set to internal. WARN!
				log.Debugf("Skipping %v, plugin active in database but not installed locally. Should plugin be set to run in 'External Mode'?\n", dbPlugin.PluginId)
			}
		}
	}

	return pluginsToStart, nil

}
