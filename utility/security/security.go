package security

import (
	"github.com/jmoiron/sqlx"
)

func CheckOrGenRSAKeysAndSecrets(db *sqlx.DB) bool {


	// check rsaPrivKey
	if ok := rsaPrivKey(db); !ok {
		return false
	}

	// check msKey
	if ok := msSecret(db); !ok {
		return false
	}


	return true
}
