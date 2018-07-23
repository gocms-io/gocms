package secure_code_repository

import (
	"github.com/myanrichal/gocms/domain/secure_code/security_code_model"
	"github.com/myanrichal/gocms/utility/log"
	"github.com/jmoiron/sqlx"
	"time"
)

type ISecureCodeRepository interface {
	Add(*security_code_model.SecureCode) error
	Delete(int64) error
	GetLatestForUserByType(int64, security_code_model.SecureCodeType) (*security_code_model.SecureCode, error)
}

type SecureCodeRepository struct {
	database *sqlx.DB
}

func DefaultSecureCodeRepository(dbx *sqlx.DB) *SecureCodeRepository {

	secureCodeRepository := &SecureCodeRepository{
		database: dbx,
	}

	return secureCodeRepository
}

func (scr *SecureCodeRepository) Add(code *security_code_model.SecureCode) error {
	code.Created = time.Now()
	// insert row
	result, err := scr.database.NamedExec(`
	INSERT INTO gocms_secure_codes (userId, type, code, created) VALUES (:userId, :type, :code, :created)
	`, code)
	if err != nil {
		log.Errorf("Error adding security code to database: %s", err.Error())
		return err
	}

	// add id to user object
	id, _ := result.LastInsertId()
	code.Id = id

	return nil
}

func (scr *SecureCodeRepository) Delete(id int64) error {
	_, err := scr.database.Exec(`
	DELETE FROM gocms_secure_codes WHERE id=?
	`, id)
	if err != nil {
		log.Errorf("Error deleting security code from database: %s", err.Error())
		return err
	}

	return nil
}

// get all events
func (scr *SecureCodeRepository) GetLatestForUserByType(id int64, codeType security_code_model.SecureCodeType) (*security_code_model.SecureCode, error) {
	var secureCode security_code_model.SecureCode
	err := scr.database.Get(&secureCode, `
	SELECT * from gocms_secure_codes WHERE userId=? AND type=? ORDER BY created DESC LIMIT 1
	`, id, codeType)
	if err != nil {
		log.Errorf("Error getting getting latest security code for user from database: %s", err.Error())
		return nil, err
	}
	return &secureCode, nil
}
