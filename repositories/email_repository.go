package repositories

import (
	"github.com/jmoiron/sqlx"
	"github.com/gocms-io/gocms/models"
	"log"
	"time"
)

type IEmailRepository interface {
	Add(*models.Email) error
	Get(int) (*models.Email, error)
	GetByAddress(string) (*models.Email, error)
	GetByUserId(int) ([]models.Email, error)
	GetPrimaryByUserId(int) (*models.Email, error)
	PromoteEmail(emailId int, userId int) error
	Update(email *models.Email) error
	Delete(int) error
}

type EmailRepository struct {
	database *sqlx.DB
}

const emailFields = "id, userId, email, isVerified, isPrimary, created"

func DefaultEmailRepository(db interface{}) *EmailRepository {
	d, ok := db.(*sqlx.DB)
	if !ok {
		log.Fatalf("Email Repo expected *sqlx.DB but got %T.\n", db)
	}
	emailRepository := &EmailRepository{
		database: d,
	}
	return emailRepository
}

func (er *EmailRepository) Add(e *models.Email) error {
	e.Created = time.Now()
	// insert row
	result, err := er.database.NamedExec(`
	INSERT INTO gocms_emails (userId, email, isVerified, isPrimary) VALUES (:userId, :email, :isVerified, :isPrimary)
	`, e)
	if err != nil {
		log.Printf("Error adding email to database: %s", err.Error())
		return err
	}
	// add id to user object
	id, _ := result.LastInsertId()
	e.Id = int(id)

	return nil
}

func (er *EmailRepository) Get(id int) (*models.Email, error) {
	// get email by id
	var email models.Email
	err := er.database.Get(&email, `
	SELECT ` + emailFields + `
	FROM gocms_emails
	WHERE gocms_emails.id=?
	`, id)
	if err != nil {
		log.Printf("Error getting email by id: %s", err.Error())
		return nil, err
	}

	return &email, nil
}

func (er *EmailRepository) GetByAddress(address string) (*models.Email, error) {
	// get email by id
	var email models.Email
	err := er.database.Get(&email, `
	SELECT ` + emailFields + `
	FROM gocms_emails
	WHERE gocms_emails.email=?
	`, address)
	if err != nil {
		log.Printf("Error getting email by address: %s", err.Error())
		return nil, err
	}

	return &email, nil
}

func (er *EmailRepository) GetByUserId(userId int) ([]models.Email, error) {
	// get email by id
	var emails []models.Email
	err := er.database.Select(&emails, `
	SELECT ` + emailFields + `
	FROM gocms_emails
	WHERE gocms_emails.userId=?
	`, userId)
	if err != nil {
		log.Printf("Error getting email by userId: %s", err.Error())
		return nil, err
	}

	return emails, nil
}

func (er *EmailRepository) GetPrimaryByUserId(userId int) (*models.Email, error) {
	// get email by id
	var email models.Email
	err := er.database.Get(&email, `
	SELECT ` + emailFields + `
	FROM gocms_emails
	WHERE gocms_emails.userId=?
	AND gocms_emails.isPrimary=?
	`, userId, 1)
	if err != nil {
		log.Printf("Error getting primary email by userId: %s", err.Error())
		return nil, err
	}

	return &email, nil
}

func (er *EmailRepository) Update(email *models.Email) error {
	// get email by id
	_, err := er.database.NamedExec(`
	UPDATE gocms_emails SET isVerified=:isVerified, isPrimary=:isPrimary WHERE id=:id
	`, email)
	if err != nil {
		log.Printf("Error updating email: %s", err.Error())
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
		log.Printf("Error bulk setting email to non-primary: %s", err.Error())
		return err
	}

	// set new primary email
	_, err = er.database.Exec(`
	UPDATE gocms_emails SET isPrimary=? WHERE id=?
	`, true, emailId)
	if err != nil {
		log.Printf("Error setting new primary email: %s", err.Error())
		return err
	}

	return nil
}

func (er *EmailRepository) Delete(id int) error {
	_, err := er.database.Exec(`
	DELETE FROM gocms_emails WHERE id=?
	`, id)
	if err != nil {
		log.Printf("Error deleting email from database: %s", err.Error())
		return err
	}

	return nil
}
