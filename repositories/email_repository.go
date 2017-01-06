package repositories

import (
	"time"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/database"
	"github.com/jmoiron/sqlx"
	"log"
)

type IEmailRepository interface {
	Add(*models.Email) error
	Delete(int) error
}

type EmailRepository struct {
	database *sqlx.DB
}


func DefaultEmailRepository(db *database.Database) *EmailRepository{
	emailRepository := &EmailRepository{
		database: db.Dbx,
	}

	return emailRepository
}

func (scr *EmailRepository) Add(e *models.Email) error {
	e.Created = time.Now()
	// insert row
	result, err := scr.database.NamedExec(`
	INSERT INTO gocms_emails (userId, email, verified, isPrimary, created) VALUES (:userId, :email, :verified, :isPrimary, :created)
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

func (scr *EmailRepository) Delete(id int) error {
	_, err := scr.database.Exec(`
	DELETE FROM gocms_email WHERE id=?
	`, id)
	if err != nil {
		log.Printf("Error deleting email from database: %s", err.Error())
		return err
	}

	return nil
}
