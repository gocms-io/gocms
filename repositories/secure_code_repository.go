package repositories

import (
	"time"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/database"
	"github.com/jmoiron/sqlx"
)

type ISecureCodeRepository interface {
	Add(*models.SecureCode) error
	GetLatestForUserByType(int, models.SecureCodeType) (*models.SecureCode, error)
}

type SecureCodeRepository struct {
	database *sqlx.DB
}


func DefaultSecureCodeRepository(db *database.Database) *SecureCodeRepository{
	secureCodeRepository := &SecureCodeRepository{
		database: db.Dbx,
	}

	return secureCodeRepository
}

func (scr *SecureCodeRepository) Add(code *models.SecureCode) error {
	code.Created = time.Now()
	// insert row
	result, err := scr.database.NamedExec(`
	INSERT INTO secure_codes (userId, type, code, created) VALUES (:userId, :type, :code, :created)
	`, code)
	if err != nil {
		return err
	}

	// add id to user object
	id, _ := result.LastInsertId()
	code.Id = int(id)

	return nil
}

// get all events
func (scr *SecureCodeRepository) GetLatestForUserByType(id int, codeType models.SecureCodeType) (*models.SecureCode, error) {
	var secureCode models.SecureCode
	err := scr.database.Get(&secureCode, `
	SELECT * from secure_codes WHERE userId=? AND type=? ORDER BY created DESC LIMIT 1
	`, id, codeType)
	if err != nil {
		return nil, err
	}
	return &secureCode, nil
}
