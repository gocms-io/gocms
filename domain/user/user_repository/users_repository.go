package user_repository

import (
	"database/sql"
	"github.com/gocms-io/gocms/domain/user/user_model"
	"github.com/gocms-io/gocms/utility/errors"
	"github.com/jmoiron/sqlx"
	"time"
	"github.com/gocms-io/gocms/utility/log"
)

type IUserRepository interface {
	Get(int) (*user_model.User, error)
	GetByEmail(string) (*user_model.User, error)
	GetAll() (*[]user_model.User, error)
	Add(*user_model.User) error
	Update(int, *user_model.User) error
	UpdatePassword(int, string) error
	Delete(int) error
	SetEnabled(int, bool) error
}

type UserRepository struct {
	database *sqlx.DB
}

func DefaultUserRepository(dbx *sqlx.DB) *UserRepository {
	userRepository := &UserRepository{
		database: dbx,
	}

	return userRepository
}

// get user by id
func (ur *UserRepository) Get(id int) (*user_model.User, error) {
	var user user_model.User
	err := ur.database.Get(&user, `
	SELECT gocms_users.*, gocms_emails.email, gocms_emails.isVerified
	FROM gocms_users
	INNER JOIN gocms_emails
	ON gocms_users.id=gocms_emails.userId
	WHERE gocms_users.id=?
	AND isPrimary=1
	Limit 1;
	`, id)
	if err != nil {
		log.Errorf("Error getting all user from database: %s", err.Error())
		return nil, err
	}

	return &user, nil
}

// get user by email
func (ur *UserRepository) GetByEmail(email string) (*user_model.User, error) {

	// first get the user by email
	var user user_model.User
	err := ur.database.Get(&user, `
	SELECT gocms_users.*, gocms_emails.email, gocms_emails.isVerified
	FROM gocms_users
	INNER JOIN gocms_emails
	ON gocms_users.id=gocms_emails.userId
	WHERE gocms_users.id=(
		SELECT gocms_emails.userId AS u FROM gocms_emails
		WHERE gocms_emails.email=?
	)
	AND isPrimary=1
	Limit 1;
	`, email)
	if err != nil {
		log.Errorf("Error mapping user by email from database: %s", err.Error())
		return nil, err
	}

	return &user, nil
}

// get a list of all users
func (ur *UserRepository) GetAll() (*[]user_model.User, error) {
	var users []user_model.User
	err := ur.database.Select(&users, `
	SELECT gocms_users.*, gocms_emails.email, gocms_emails.isVerified
	FROM gocms_users
	INNER JOIN gocms_emails
	ON gocms_users.id=gocms_emails.userId AND gocms_emails.isPrimary=1;
	`)
	if err != nil {
		log.Errorf("Error getting all users from database: %s", err.Error())
		return nil, err
	}
	return &users, nil
}

func (ur *UserRepository) Add(user *user_model.User) error {

	// check if user exists
	if ur.userExistsByEmail(user.Email) {
		return errors.NewToUser(errors.ApiError_UserAlreadyExists)
	}

	user.Created = time.Now()

	// insert user
	result, err := ur.database.NamedExec(`
	INSERT INTO gocms_users (fullName, gender, photo, minAge, maxAge, password, enabled, created) VALUES (:fullName, :gender, :photo, :minAge, :maxAge, :password, :enabled, :created)
	`, user)
	if err != nil {
		log.Errorf("Error adding user to db: %s", err.Error())
		return err
	}
	id, _ := result.LastInsertId()
	user.Id = int(id)

	return nil
}

func (ur *UserRepository) Update(id int, user *user_model.User) error {
	// insert row
	user.Id = id
	_, err := ur.database.NamedExec(`
	UPDATE gocms_users SET fullName=:fullName, gender=:gender, photo=:photo, maxAge=:maxAge, minAge=:minAge WHERE id=:id
	`, user)
	if err != nil {
		log.Errorf("Error updating user in database: %s", err.Error())
		return err
	}

	return nil
}

func (ur *UserRepository) SetEnabled(id int, enabled bool) error {
	_, err := ur.database.NamedExec(`
	UPDATE gocms_users SET enabled=:enabled WHERE id=:id
	`, map[string]interface{}{"enabled": enabled, "id": id})
	if err != nil {
		log.Errorf("Error setting enabled for user in database: %s", err.Error())

		return err
	}

	return nil
}

func (ur *UserRepository) UpdatePassword(id int, hash string) error {
	// insert row
	user := user_model.User{
		Id:       id,
		Password: hash,
	}
	_, err := ur.database.NamedExec(`
	UPDATE gocms_users SET password=:password WHERE id=:id
	`, user)
	if err != nil {
		log.Errorf("Error getting updating password for user in database: %s", err.Error())
		return err
	}

	return nil
}

func (ur *UserRepository) Delete(id int) error {

	if id == 0 {
		return errors.New("Missing user id. Can't delete user from database")
	}

	_, err := ur.database.Exec(`
	DELETE FROM gocms_users WHERE id=?
	`, id)
	if err != nil {
		log.Errorf("Error deleting users from database: %s", err.Error())
		return err
	}

	return nil
}

func (ur *UserRepository) userExistsByEmail(email string) bool {
	user := user_model.User{}
	err := ur.database.QueryRowx(`
	SELECT email FROM gocms_emails WHERE email = ?
	`, email).Scan(&user.Email)
	if err != nil && err != sql.ErrNoRows {
		log.Errorf("Error checking if user exists by email in database: %s", err.Error())
		return true
	}
	return false
}
