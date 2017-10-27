package plugin_services

import (
	"encoding/json"
	"github.com/gocms-io/gocms/domain/plugin/plugin_model"
	"io/ioutil"
	"log"
)

func (ps *PluginsService) parseManifest(fileUri string) (*plugin_model.PluginManifest, error) {
	var manifest plugin_model.PluginManifest

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
