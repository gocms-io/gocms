package user_service

import (
	"github.com/myanrichal/gocms/utility"
	"github.com/myanrichal/gocms/utility/errors"
	"github.com/myanrichal/gocms/domain/user/user_model"
	"github.com/myanrichal/gocms/init/repository"
	"github.com/myanrichal/gocms/domain/mail/mail_service"
	"github.com/myanrichal/gocms/domain/email/email_model"
	"github.com/myanrichal/gocms/domain/acl/authentication/authentication_service"
)

type IUserService interface {
	Add(*user_model.User) error
	Get(int64) (*user_model.User, error)
	GetByEmail(string) (*user_model.User, error)
	GetAll() (*[]user_model.User, error)
	Delete(int64) error
	Update(int64, *user_model.User) error
	UpdatePassword(int64, string) error
	SetEnabled(int64, bool) error
}

type UserService struct {
	AuthService       authentication_service.IAuthService
	MailService       mail_service.IMailService
	RepositoriesGroup *repository.RepositoriesGroup
}

func DefaultUserService(rg *repository.RepositoriesGroup, authService *authentication_service.AuthService, mailService *mail_service.MailService) *UserService {
	userService := &UserService{
		AuthService:       authService,
		MailService:       mailService,
		RepositoriesGroup: rg,
	}

	return userService
}

func (us *UserService) Get(id int64) (*user_model.User, error) {

	user, err := us.RepositoriesGroup.UsersRepository.Get(id)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (us *UserService) GetByEmail(email string) (*user_model.User, error) {
	// check emails for userid
	user, err := us.RepositoriesGroup.UsersRepository.GetByEmail(email)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (us *UserService) GetAll() (*[]user_model.User, error) {

	users, err := us.RepositoriesGroup.UsersRepository.GetAll()
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (us *UserService) Add(user *user_model.User) error {

	// email must exist and not be null
	if user.Email == "" {
		return errors.New("A valid email address was not provided. The user cannot be created.")
	}

	// hash password
	if user.Password == "" {
		user.Password, _ = utility.GenerateRandomString(32)
	} else {
		// password complexity
		if !us.AuthService.PasswordIsComplex(user.Password) {
			return errors.NewToUser("Password is not complex enough.")
		}
	}

	hashPassword, err := us.AuthService.HashPassword(user.Password)
	if err != nil {
		return nil
	}
	user.Password = hashPassword

	// add user to db
	err = us.RepositoriesGroup.UsersRepository.Add(user)
	if err != nil {
		return err
	}

	// add email to db and attach to user
	emailToAdd := email_model.Email{
		Email:     user.Email,
		UserId:    user.Id,
		IsPrimary: true,
	}
	err = us.RepositoriesGroup.EmailRepository.Add(&emailToAdd)
	if err != nil {
		return err
	}

	return nil
}

func (us *UserService) Delete(id int64) error {

	err := us.RepositoriesGroup.UsersRepository.Delete(id)
	if err != nil {
		return err
	}
	return nil
}

func (us *UserService) Update(id int64, userForUpdate *user_model.User) error {
	err := us.RepositoriesGroup.UsersRepository.Update(id, userForUpdate)
	if err != nil {
		return err
	}

	return nil
}
func (us *UserService) UpdatePassword(id int64, password string) error {

	//check complexity
	if !us.AuthService.PasswordIsComplex(password) {
		return errors.NewToUser("Password is not complex enough.")
	}

	// make hash
	newHash, err := us.AuthService.HashPassword(password)
	if err != nil {
		return err
	}

	// update database
	err = us.RepositoriesGroup.UsersRepository.UpdatePassword(id, newHash)
	if err != nil {
		return err
	}

	return nil
}

func (us *UserService) SetEnabled(id int64, enabled bool) error {
	return us.RepositoriesGroup.UsersRepository.SetEnabled(id, enabled)
}
