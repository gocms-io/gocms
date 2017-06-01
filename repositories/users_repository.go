package repositories

import (
	"database/sql"
	"github.com/jmoiron/sqlx"
	"github.com/gocms-io/gocms/models"
	"github.com/gocms-io/gocms/utility/errors"
	"log"
	"time"
)

type IUserRepository interface {
	Get(int) (*models.User, error)
	GetByEmail(string) (*models.User, error)
	GetAll() (*[]models.User, error)
	Add(*models.User) error
	Update(int, *models.User) error
	UpdatePassword(int, string) error
	Delete(int) error
	SetEnabled(int, bool) error
}

type UserRepository struct {
	database *sqlx.DB
}

const uUserFields = "u.id, u.fullName, u.password, u.gender, u.minAge, u.maxAge, u.photo, u.enabled, u.created"

func DefaultUserRepository(db interface{}) *UserRepository {
	d, ok := db.(*sqlx.DB)
	if !ok {
		log.Fatalf("User Repo expected *sqlx.DB but got %T.\n", db)
	}
	userRepository := &UserRepository{
		database: d,
	}

	return userRepository
}

// get user by id
func (ur *UserRepository) Get(id int) (*models.User, error) {
	var user models.User
	err := ur.database.Get(&user, `
	SELECT ` + uUserFields + `, e.email, e.isVerified
	FROM gocms_users u
	INNER JOIN gocms_emails e
	ON u.id=e.userId
	WHERE u.id=?
	AND e.isPrimary=1
	Limit 1;
	`, id)
	if err != nil {
		log.Printf("Error getting all user from database: %s", err.Error())
		return nil, err
	}

	return &user, nil
}

// get user by email
func (ur *UserRepository) GetByEmail(email string) (*models.User, error) {

	// first get the user by email
	var user models.User
	err := ur.database.Get(&user, `
	SELECT ` + uUserFields + `, e.email, e.isVerified
	FROM gocms_users u
	INNER JOIN gocms_emails e
	ON u.id=e.userId
	WHERE u.id=(
		SELECT userId FROM gocms_emails
		WHERE email=?
	)
	AND isPrimary=1
	Limit 1;
	`, email)
	if err != nil {
		log.Printf("Error mapping user by email from database: %s", err.Error())
		return nil, err
	}

	return &user, nil
}

// get a list of all users
func (ur *UserRepository) GetAll() (*[]models.User, error) {
	var users []models.User
	err := ur.database.Select(&users, `
	SELECT ` + uUserFields + `, e.email, e.isVerified
	FROM gocms_users u
	INNER JOIN gocms_emails e
	ON u.id=e.userId
	WHERE u.id=(
		SELECT userId FROM gocms_emails
		WHERE email=?
	)
	AND isPrimary=1
	Limit 1;
	`)
	if err != nil {
		log.Printf("Error getting all users from database: %s", err.Error())
		return nil, err
	}
	return &users, nil
}

func (ur *UserRepository) Add(user *models.User) error {

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
		log.Printf("Error adding user to db: %s", err.Error())
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
	UPDATE gocms_users SET fullName=:fullName, gender=:gender, photo=:photo, maxAge=:maxAge, minAge=:minAge WHERE id=:id
	`, user)
	if err != nil {
		log.Printf("Error updating user in database: %s", err.Error())
		return err
	}

	return nil
}

func (ur *UserRepository) SetEnabled(id int, enabled bool) error {
	_, err := ur.database.NamedExec(`
	UPDATE gocms_users SET enabled=:enabled WHERE id=:id
	`, map[string]interface{}{"enabled": enabled, "id": id})
	if err != nil {
		log.Printf("Error setting enabled for user in database: %s", err.Error())

		return err
	}

	return nil
}

func (ur *UserRepository) UpdatePassword(id int, hash string) error {
	// insert row
	user := models.User{
		Id:       id,
		Password: hash,
	}
	_, err := ur.database.NamedExec(`
	UPDATE gocms_users SET password=:password WHERE id=:id
	`, user)
	if err != nil {
		log.Printf("Error getting updating password for user in database: %s", err.Error())
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
		log.Printf("Error deleting users from database: %s", err.Error())
		return err
	}

	return nil
}

func (ur *UserRepository) userExistsByEmail(email string) bool {
	user := models.User{}
	err := ur.database.QueryRowx(`
	SELECT email FROM gocms_emails WHERE email = ?
	`, email).Scan(&user.Email)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("Error checking if user exists by email in database: %s", err.Error())
		return true
	}
	return false
}
