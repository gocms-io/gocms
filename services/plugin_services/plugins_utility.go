package plugin_services

import (
	"io/ioutil"
	"log"
	"encoding/json"
	"github.com/gocms-io/gocms/models"
)

func (ps *PluginsService) parseManifest(fileUri string) (*models.PluginManifest, error) {
	var manifest models.PluginManifest

	// read file in
	raw, err := ioutil.ReadFile(fileUri)
	if err != nil {
		log.Printf("Error reading raw plugin manifest file %s: %s\n", fileUri, err.Error())
		return nil, err
	}

	err = json.Unmarshal(raw, &manifest)
	if err != nil {
		log.Printf("Error parsing manifest file %s: %s\n", fileUri, err.Error())
		return nil, err
	}

	return &manifest, nil
}

