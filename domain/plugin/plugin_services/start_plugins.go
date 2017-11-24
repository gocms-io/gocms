package plugin_services

import (
	"bufio"
	"fmt"
	"github.com/gocms-io/gocms/domain/plugin/plugin_middleware/plugin_proxy_middleware"
	"github.com/gocms-io/gocms/domain/plugin/plugin_model"
	"github.com/gocms-io/gocms/utility"
	"github.com/gocms-io/gocms/utility/log"
	"os"
	"os/exec"
	"path/filepath"
)

func (ps *PluginsService) StartActivePlugins() error {

	// get plugins that are both active in the database and installed on disk
	pluginsToStart, err := ps.getPluginsToStart()
	if err != nil {
		log.Errorf("No plugins to start due to error\n.")
		return err
	}

	for _, plugin := range pluginsToStart {
		_ = ps.startPlugin(plugin)
	}

	return nil

}

func (ps *PluginsService) startPlugin(plugin *plugin_model.Plugin) error {
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
	newPpmChan := make(chan *plugin_proxy_middleware.PluginProxyMiddleware) // this channel is used to update the port if plugin is restarted

	// find port and start microservice
	log.Infof("Microservice Starting :%v\n", plugin.Manifest.Id)

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

	// create proxy for use during registration
	plugin.Proxy = &plugin_proxy_middleware.PluginProxyMiddleware{
		Port:            pluginPort,
		Schema:          "http",
		Host:            "localhost",
		PluginId:        plugin.Manifest.Id,
		UpdateProxyChan: newPpmChan,
		Disabled:        false,
	}

	// add plugin to active list for monitoring and other things
	ps.activePlugins[plugin.Manifest.Id] = plugin

	go func() {
		err := <-done
		plugin.Running = false
		if err != nil {
			log.Errorf("Microservice, %v, stopped unexpectedly: %v\n Attempting restart...", plugin.Manifest.Id, err.Error())
			err := ps.startPlugin(plugin)
			if err != nil {
				plugin.Proxy.Disabled = true
				newPpmChan <- plugin.Proxy
				log.Errorf("Microservice, %v, failed to restart: %v\n", plugin.Manifest.Id, err.Error())
			} else {
				newPpmChan <- plugin.Proxy
				log.Infof("Hot swapped new plugin. Running on port %v\n", plugin.Proxy.Port)
			}
		} else {
			// no error it just quit
			log.Infof("Microservice, %v, stopped\n", plugin.Manifest.Id)
		}
	}()

	return nil
}

func (ps *PluginsService) getPluginsToStart() (map[string]*plugin_model.Plugin, error) {

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
			if ps.installedPlugins[dbPluginId] != nil {
				pluginsToStart[dbPluginId] = ps.installedPlugins[dbPluginId]
			} else {
				log.Debugf("Skiping %v, plugin active in database but not installed\n", dbPlugin.PluginId)
			}
		}
	}

	return pluginsToStart, nil

}
