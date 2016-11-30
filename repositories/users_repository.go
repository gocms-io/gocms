package repositories

import (
	"database/sql"
	"errors"
	"log"
	"time"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/database"
	"github.com/jmoiron/sqlx"
)

type IUserRepository interface {
	Get(int) (*models.User, error)
	GetByEmail(string) (*models.User, error)
	GetAll() (*[]models.User, error)
	Add(*models.User) error
	Update(int, *models.User) error
	UpdatePassword(int, string) error
	Delete(int) error
}

type UserRepository struct {
	database *sqlx.DB
}


func DefaultUserRepository() *UserRepository{
	userRepository := &UserRepository{
		database: database.Dbx,
	}

	return userRepository
}

// get user by id
func (ur *UserRepository) Get(id int) (*models.User, error) {
	var user models.User
	err := ur.database.Get(&user, "SELECT * FROM users WHERE id=?", id)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// get user by email
func (ur *UserRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := ur.database.Get(&user, "SELECT * FROM users WHERE email=? OR email2=?", email, email)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// get a list of all users
func (ur *UserRepository) GetAll() (*[]models.User, error) {
	var users []models.User
	err := ur.database.Select(&users, `
	SELECT * from users
	`)
	if err != nil {
		return nil, err
	}
	return &users, nil
}

func (ur *UserRepository) Add(user *models.User) error {

	// check if user exists
	err := ur.userExistsByEmail(user.Email)
	if err != nil {
		return err
	}

	user.Created = time.Now()

	// insert user
	result, err := ur.database.NamedExec(`
	INSERT INTO users (fullName, email, email2, gender, photo, minAge, maxAge, password, created) VALUES (:fullName, :email, :email2, :gender, :photo, :minAge, :maxAge, :password, :created)
	`, user)
	if err != nil {
		return err
	}
	id, _ := result.LastInsertId()
	user.Id = int(id)

	return nil
}

func (ur *UserRepository) Update(id int, user *models.User) error {
	// insert row
	user.Id = id
	_, err := ur.database.NamedExec(`
	UPDATE users SET fullName=:fullName, email=:email, email2=:email2, gender=:gender, photo=:photo, maxAge=:maxAge, minAge=:minAge WHERE id=:id
	`, user)
	if err != nil {
		log.Println("---ERROR---", err.Error())
		return err
	}

	return nil
}

func (ur *UserRepository) UpdatePassword(id int, hash string) error {
	// insert row
	user := models.User{
		Id: id,
		Password: hash,
	}
	_, err := ur.database.NamedExec(`
	UPDATE users SET password=:password WHERE id=:id
	`, user)
	if err != nil {
		log.Println("---ERROR---", err.Error())
		return err
	}

	return nil
}

func (ur *UserRepository) Delete(id int) error {

	if id == 0 {
		return errors.New("Missing id")
	}

	_, err := ur.database.Exec(`
	DELETE FROM users WHERE id=?
	`, id)
	if err != nil {

		log.Println("---ERROR---", err.Error())
		return err
	}

	return nil
}

func (ur *UserRepository) userExistsByEmail(email string) error {
	user := models.User{}
	err := ur.database.QueryRow(`
	SELECT email, email2 FROM users WHERE email = ? OR email2 = ?
	`, email, email).Scan(&user.Email, &user.Email2)
	if err != nil && err != sql.ErrNoRows {
		return err
	}
	return nil
}


