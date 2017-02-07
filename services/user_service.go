package goCMS_services

import (
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/utility/errors"
)

type IUserService interface {
	Add(*goCMS_models.User) error
	Get(int) (*goCMS_models.User, error)
	GetByEmail(string) (*goCMS_models.User, error)
	GetAll() (*[]goCMS_models.User, error)
	Delete(int) error
	Update(int, *goCMS_models.User) error
	UpdatePassword(int, string) error
	SetEnabled(int, bool) error
}

type UserService struct {
	AuthService       IAuthService
	MailService       IMailService
	RepositoriesGroup *goCMS_repositories.RepositoriesGroup
}

func DefaultUserService(rg *goCMS_repositories.RepositoriesGroup, authService *AuthService, mailService *MailService) *UserService {
	userService := &UserService{
		AuthService:       authService,
		MailService:       mailService,
		RepositoriesGroup: rg,
	}

	return userService
}

func (us *UserService) Get(id int) (*goCMS_models.User, error) {

	user, err := us.RepositoriesGroup.UsersRepository.Get(id)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (us *UserService) GetByEmail(email string) (*goCMS_models.User, error) {
	// check emails for userid
	user, err := us.RepositoriesGroup.UsersRepository.GetByEmail(email)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (us *UserService) GetAll() (*[]goCMS_models.User, error) {

	users, err := us.RepositoriesGroup.UsersRepository.GetAll()
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (us *UserService) Add(user *goCMS_models.User) error {

	// hash password
	if user.Password == "" {
		user.Password, _ = goCMS_utility.GenerateRandomString(32)
	} else {
		// password complexity
		if !us.AuthService.PasswordIsComplex(user.Password) {
			return goCMS_errors.NewToUser("Password is not complex enough.")
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
	emailToAdd := goCMS_models.Email{
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

func (us *UserService) Delete(id int) error {

	err := us.RepositoriesGroup.UsersRepository.Delete(id)
	if err != nil {
		return err
	}
	return nil
}

func (us *UserService) Update(id int, userForUpdate *goCMS_models.User) error {
	err := us.RepositoriesGroup.UsersRepository.Update(id, userForUpdate)
	if err != nil {
		return err
	}

	return nil
}
func (us *UserService) UpdatePassword(id int, password string) error {

	//check complexity
	if !us.AuthService.PasswordIsComplex(password) {
		return goCMS_errors.NewToUser("Password is not complex enough.")
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

func (us *UserService) SetEnabled(id int, enabled bool) error {
	return us.RepositoriesGroup.UsersRepository.SetEnabled(id, enabled)
}
