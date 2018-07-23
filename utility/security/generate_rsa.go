package security

import (
	"github.com/jmoiron/sqlx"
	"github.com/myanrichal/gocms/domain/setting/setting_model"
	"github.com/myanrichal/gocms/utility/log"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
)

func rsaPrivKey(db *sqlx.DB) bool {

	var rsaPriv setting_model.Setting

	// get priv key
	err := db.Get(&rsaPriv, `
	SELECT *
	FROM gocms_settings
	WHERE name=?
	`, "RSA_PRIV")
	if err != nil {
		log.Criticalf("RSA_PRIV row doesn't exist in gocms_settings\n")
		return false
	}

	// if it is nil gen one
	if rsaPriv.Value == "" {
		reader := rand.Reader
		bitSize := 2048
		key, err := rsa.GenerateKey(reader, bitSize)
		if err != nil {
			log.Criticalf("Error creating rsa")
		}

		privKeyData := pem.EncodeToMemory(&pem.Block{
			Type:"RSA PRIVATE KEY",
			Bytes: x509.MarshalPKCS1PrivateKey(key),
		})

		pubKeyData, err := x509.MarshalPKIXPublicKey(&key.PublicKey)
		if err != nil {
			log.Criticalf("Error marshaling RSA_PUB.pem: %v\n", err.Error())
			return false
		}

		pubKeyData = pem.EncodeToMemory(&pem.Block{
			Type:"PUBLIC KEY",
			Bytes: pubKeyData,
		})

		// insert priv key
		_, err = db.Exec(`
		UPDATE gocms_settings SET value=?
		WHERE name = ?
		`, string(privKeyData), "RSA_PRIV")
		if err != nil {
			log.Criticalf("Error inserting RSA_PRIV: %v\n", err.Error())
			return false
		}

		// insert pub key
		_, err = db.Exec(`
		UPDATE gocms_settings SET value=?
		WHERE name = ?
		`, pubKeyData, "RSA_PUB")
		if err != nil {
			log.Criticalf("Error inserting RSA_PUB")
			return false
		}

		log.Infof("RSA Key Pair Created")
	}

	return true
}
