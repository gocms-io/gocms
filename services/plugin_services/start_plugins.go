package plugin_services

import (
	"bufio"
	"fmt"
	"github.com/gocms-io/gocms/controllers/middleware/plugins/proxy"
	"github.com/gocms-io/gocms/models/runtime_models"
	"github.com/gocms-io/gocms/utility"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func (ps *PluginsService) StartActivePlugins() error {

	// get plugins that are both active in the database and installed on disk
	pluginsToStart, err := ps.getPluginsToStart()
	if err != nil {
		fmt.Printf("No plugins to start due to error\n.")
		return err
	}

	var startingPort int = 30002
	for _, plugin := range pluginsToStart {

		// find port to run on
		port, err := utility.FindPort(startingPort)
		if err != nil {
			log.Printf("Couldn't start plugin %v, error: %v", plugin.Manifest.Name, err.Error())
			return err
		}
		startingPort = port + 1

		// build command
		cmd := exec.Command(filepath.FromSlash("./"+plugin.BinaryFile), fmt.Sprintf("-port=%d", port))
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

		// find port and start microservice
		log.Printf("Starting microservice: %s - %v\n", plugin.Manifest.Name, plugin.Manifest.Id)
		err = cmd.Start()
		if err != nil {
			fmt.Fprintln(os.Stderr, "Error starting Cmd", err)
			return err
		}

		// add handle to command
		plugin.Cmd = cmd

		// create proxy for use during registration
		plugin.Proxy = &plugin_proxy_mdl.PluginProxyMiddleware{
			Port:     port,
			Schema:   "http",
			Host:     "localhost",
			PluginId: plugin.Manifest.Id,
		}

		// add plugin to active list for monitoring and other things
		ps.activePlugins[plugin.Manifest.Id] = plugin
	}

	return nil

}

func (ps *PluginsService) getPluginsToStart() (map[string]*runtime_models.Plugin, error) {

	// get plugins listed in database
	databasePlugins, err := ps.GetDatabasePlugins()
	if err != nil {
		fmt.Printf("Couldn't get plugins to start: %v\n", err)
		return nil, err
	}

	pluginsToStart := make(map[string]*runtime_models.Plugin)

	// loop through database plugins
	for dbPluginId, dbPlugin := range databasePlugins {
		if dbPlugin.IsActive {
			if ps.installedPlugins[dbPluginId] != nil {
				pluginsToStart[dbPluginId] = ps.installedPlugins[dbPluginId]
			} else {
				fmt.Printf("Skiping %v, plugin active in database but not installed\n", dbPlugin.PluginId)
			}
		}
	}

	return pluginsToStart, nil

}
