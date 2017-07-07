package plugin_services

import (
	"os/exec"
	"fmt"
	"os"
	"bufio"
	"log"
	"github.com/gocms-io/gocms/controllers/middleware/plugins/proxy"
	"github.com/gocms-io/gocms/utility"
)

func (ps *PluginsService) StartPlugins() error {

	var startingPort int = 30002
	for _, plugin := range ps.Plugins {

		// find port to run on
		port, err := utility.FindPort(startingPort)
		if err != nil {
			log.Printf("Couldn't start plugin %v, error: %v", plugin.Manifest.Name, err.Error())
			return err
		}
		startingPort = port + 1

		// build command
		cmd := exec.Command(plugin.BinaryPath, fmt.Sprintf("-port=%d", port))

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
		log.Printf("Starting microservice: %s\n", plugin.Manifest.Name)
		err = cmd.Start()
		if err != nil {
			fmt.Fprintln(os.Stderr, "Error starting Cmd", err)
			return err
		}

		// add handle to command
		plugin.cmd = cmd

		// create proxy for use during registration
		plugin.Proxy = &plugin_proxy_mdl.PluginProxyMiddleware{
			Port:   port,
			Schema: "http",
			Host:   "localhost",
		}
	}

	return nil

}