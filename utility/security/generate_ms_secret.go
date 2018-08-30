package security

import (
	"github.com/jmoiron/sqlx"
	"github.com/cqlcorp/gocms/domain/setting/setting_model"
	"github.com/cqlcorp/gocms/utility/log"
	"github.com/cqlcorp/gocms/utility"
)

func msSecret(db *sqlx.DB) bool {

	var msKey setting_model.Setting

	// get priv key
	err := db.Get(&msKey, `
	SELECT *
	FROM gocms_settings
	WHERE name=?
	`, "MS_SECRET_KEY")
	if err != nil {
		log.Criticalf("MS_SECRET_KEY row doesn't exist in gocms_settings\n")
		return false
	}

	// if it is nil gen one
	if msKey.Value == "" {
		key, err := utility.GenerateRandomString(16)
		if err != nil {
			log.Criticalf("Error creating msKey")
		}

		// insert msKey
		_, err = db.Exec(`
		UPDATE gocms_settings SET value=?
		WHERE name = ?
		`, key, "MS_SECRET_KEY")
		if err != nil {
			log.Criticalf("Error inserting MS_SECRET_KEY: %v\n", err.Error())
			return false
		}

		log.Infof("MS Key Created")
	}

	return true
}

