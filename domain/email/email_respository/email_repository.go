package email_respository

import (
	"github.com/gocms-io/gocms/domain/email/email_model"
	"github.com/gocms-io/gocms/utility/log"
	"github.com/jmoiron/sqlx"
	"time"
)

type IEmailRepository interface {
	Add(*email_model.Email) error
	Get(int) (*email_model.Email, error)
	GetByAddress(string) (*email_model.Email, error)
	GetByUserId(int) ([]email_model.Email, error)
	GetPrimaryByUserId(int) (*email_model.Email, error)
	PromoteEmail(emailId int, userId int) error
	Update(email *email_model.Email) error
	Delete(int) error
}

type EmailRepository struct {
	database *sqlx.DB
}

func DefaultEmailRepository(dbx *sqlx.DB) *EmailRepository {
	emailRepository := &EmailRepository{
		database: dbx,
	}
	return emailRepository
}

func (er *EmailRepository) Add(e *email_model.Email) error {
	e.Created = time.Now()
	// insert row
	result, err := er.database.NamedExec(`
	INSERT INTO gocms_emails (userId, email, isVerified, isPrimary) VALUES (:userId, :email, :isVerified, :isPrimary)
	`, e)
	if err != nil {
		log.Errorf("Error adding email to database: %s", err.Error())
		return err
	}
	// add id to user object
	id, _ := result.LastInsertId()
	e.Id = int(id)

	return nil
}

func (er *EmailRepository) Get(id int) (*email_model.Email, error) {
	// get email by id
	var email email_model.Email
	err := er.database.Get(&email, `
	SELECT gocms_emails.*
	FROM gocms_emails
	WHERE gocms_emails.id=?
	`, id)
	if err != nil {
		log.Errorf("Error getting email by id: %s", err.Error())
		return nil, err
	}

	return &email, nil
}

func (er *EmailRepository) GetByAddress(address string) (*email_model.Email, error) {
	// get email by id
	var email email_model.Email
	err := er.database.Get(&email, `
	SELECT gocms_emails.*
	FROM gocms_emails
	WHERE gocms_emails.email=?
	`, address)
	if err != nil {
		log.Errorf("Error getting email by address: %s", err.Error())
		return nil, err
	}

	return &email, nil
}

func (er *EmailRepository) GetByUserId(userId int) ([]email_model.Email, error) {
	// get email by id
	var emails []email_model.Email
	err := er.database.Select(&emails, `
	SELECT gocms_emails.*
	FROM gocms_emails
	WHERE gocms_emails.userId=?
	`, userId)
	if err != nil {
		log.Errorf("Error getting email by userId: %s", err.Error())
		return nil, err
	}

	return emails, nil
}

func (er *EmailRepository) GetPrimaryByUserId(userId int) (*email_model.Email, error) {
	// get email by id
	var email email_model.Email
	err := er.database.Get(&email, `
	SELECT gocms_emails.*
	FROM gocms_emails
	WHERE gocms_emails.userId=?
	AND gocms_emails.isPrimary=?
	`, userId, 1)
	if err != nil {
		log.Errorf("Error getting primary email by userId: %s", err.Error())
		return nil, err
	}

	return &email, nil
}

func (er *EmailRepository) Update(email *email_model.Email) error {
	// get email by id
	_, err := er.database.NamedExec(`
	UPDATE gocms_emails SET isVerified=:isVerified, isPrimary=:isPrimary WHERE id=:id
	`, email)
	if err != nil {
		log.Errorf("Error updating email: %s", err.Error())
		return err
	}

	return nil
}

func (er *EmailRepository) PromoteEmail(emailId int, userId int) error {
	// set all emails to not be primary
	_, err := er.database.Exec(`
	UPDATE gocms_emails SET isPrimary=? WHERE userId=?
	`, false, userId)
	if err != nil {
		log.Errorf("Error bulk setting email to non-primary: %s", err.Error())
		return err
	}

	// set new primary email
	_, err = er.database.Exec(`
	UPDATE gocms_emails SET isPrimary=? WHERE id=?
	`, true, emailId)
	if err != nil {
		log.Errorf("Error setting new primary email: %s", err.Error())
		return err
	}

	return nil
}

func (er *EmailRepository) Delete(id int) error {
	_, err := er.database.Exec(`
	DELETE FROM gocms_emails WHERE id=?
	`, id)
	if err != nil {
		log.Errorf("Error deleting email from database: %s", err.Error())
		return err
	}

	return nil
}
