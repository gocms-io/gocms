package secure_code_repository

import (
	"github.com/gocms-io/gocms/domain/secure_code/security_code_model"
	"github.com/jmoiron/sqlx"
	"log"
	"time"
)

type ISecureCodeRepository interface {
	Add(*security_code_model.SecureCode) error
	Delete(int) error
	GetLatestForUserByType(int, security_code_model.SecureCodeType) (*security_code_model.SecureCode, error)
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
		log.Printf("Error adding security code to database: %s", err.Error())
		return err
	}

	// add id to user object
	id, _ := result.LastInsertId()
	code.Id = int(id)

	return nil
}

func (scr *SecureCodeRepository) Delete(id int) error {
	_, err := scr.database.Exec(`
	DELETE FROM gocms_secure_codes WHERE id=?
	`, id)
	if err != nil {
		log.Printf("Error deleting security code from database: %s", err.Error())
		return err
	}

	return nil
}

// get all events
func (scr *SecureCodeRepository) GetLatestForUserByType(id int, codeType security_code_model.SecureCodeType) (*security_code_model.SecureCode, error) {
	var secureCode security_code_model.SecureCode
	err := scr.database.Get(&secureCode, `
	SELECT * from gocms_secure_codes WHERE userId=? AND type=? ORDER BY created DESC LIMIT 1
	`, id, codeType)
	if err != nil {
		log.Printf("Error getting getting latest security code for user from database: %s", err.Error())
		return nil, err
	}
	return &secureCode, nil
}
