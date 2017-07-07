package plugin_services

import (
	"path/filepath"
	"log"
	"os"
	"runtime"
	"fmt"
)

func (ps *PluginsService) FindPlugins() error {

	// find all plugins
	err := filepath.Walk("./content/plugins", ps.visitPlugin)

	if err != nil {
		log.Printf("Error finding plugins while traversing plugin directory: %s\n", err.Error())
		return err
	}

	return err
}

func (ps *PluginsService) visitPlugin(path string, f os.FileInfo, err error) error {
	if err != nil {
		log.Printf("Error traversing %s, %s\n", path, err.Error())
	}

	// parse manifests as they are found
	if f.Mode().IsRegular() && f.Name() == "manifest.json" {
		manifest, err := ps.parseManifest(path)
		if err != nil {
			return err
		}

		// verify that there is a main.go file
		mainPath, _ := filepath.Split(path)
		mainFilePath := filepath.Join(mainPath, manifest.Services.Bin)

		// if windows add .exe to the bin
		// if windows add exe
		if runtime.GOOS == "windows" {
			mainFilePath = fmt.Sprintf("%s.exe", mainFilePath)
		}

		mainFile, err := os.Stat(mainFilePath)
		if err != nil {
			log.Printf("No main file for plugin %s: %s\n", manifest.Name, err.Error())
			return err
		}

		if !mainFile.Mode().IsRegular() {
			log.Printf("Main file for plugin %s, apprears to be corrupted: %s\n", manifest.Name, err.Error())
			return err
		}

		plugin := Plugin{
			BinaryPath: mainFilePath,
			Manifest:   manifest,
		}

		ps.Plugins = append(ps.Plugins, &plugin)
	}

	return nil
}
