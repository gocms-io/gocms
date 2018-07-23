package manifest_utl

import (
	"io/ioutil"
	"github.com/myanrichal/gocms/utility/log"
	"github.com/myanrichal/gocms/domain/plugin/plugin_model"
	"encoding/json"
	"fmt"
	"github.com/myanrichal/gocms/utility/errors"
	"database/sql"
)

func InsertManifest(filePath string, iDriver interface{}) error {
	raw, err := ioutil.ReadFile(filePath)
	if err !=nil {
		log.Errorf("Error reading manifest at %v: %v\n", filePath, err.Error())
		return err
	}

	var manifest plugin_model.PluginManifest
	err = json.Unmarshal(raw, &manifest)
	if err != nil {
		log.Errorf("Error parsing manifest at %v: %v\n", filePath, err.Error())
		return err
	}
	drvr, ok := iDriver.(sql.DB)
	if !ok {
		err = errors.New(fmt.Sprintf("SQL interface for plugin %v resolved as %T", manifest.Id, drvr))
		log.Errorf("%v\n", err.Error())
		return err
	}


	_, err = drvr.Exec(`
	UPDATE gocms_plugins SET manifest=?
	WHERE pluginId = ?
	`, string(raw), manifest.Id)
	if err != nil {
		log.Errorf("Error updating manifest %v in plugin table: %v\n", manifest.Id, err.Error())
	}

	log.Infof("%v manifest updated in database\n", manifest.Id)

	return nil
}