package services

import (
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/utility"
)

type IUserService interface {
	Add(*models.User) error
	Get(int) (*models.User, error)
	GetByEmail(string) (*models.User, error)
	GetAll() (*[]models.User, error)
	Delete(int) error
	Update(int, *models.User) error
	UpdatePassword(int, string) error
}

type UserService struct {
	userRepo    repositories.IUserRepository
	authService IAuthService
	mailService IMailService
}

var userService *UserService

func init() {
	userService = &UserService{
		userRepo: new(repositories.UserRepository),
		authService: new(AuthService),
		mailService: new(MailService),
	}
}

func (us *UserService) Get(id int) (*models.User, error) {

	user, err := userService.userRepo.Get(id)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (us *UserService) GetByEmail(email string) (*models.User, error) {
	user, err := userService.userRepo.GetByEmail(email)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (us *UserService) GetAll() (*[]models.User, error) {

	users, err := userService.userRepo.GetAll()
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (us *UserService) Add(user *models.User) error {

	// hash password
	if user.NewPassword == "" {
		user.NewPassword, _ = utility.GenerateRandomString(32)
	}
	hashPassword, err := userService.authService.HashPassword(user.NewPassword)
	if err != nil {
		return nil
	}
	user.Password = hashPassword

	// add to db
	err = userService.userRepo.Add(user)
	if err != nil {
		return err
	}

	return nil
}

func (us *UserService) Delete(id int) error {

	err := userService.userRepo.Delete(id)
	if err != nil {
		return err
	}
	return nil
}

func (us *UserService) Update(id int, userForUpdate *models.User) error {
	err := userService.userRepo.Update(id, userForUpdate)
	if err != nil {
		return err
	}

	return nil
}
func (us *UserService) UpdatePassword(id int, password string) error {

	// check complexity
	if len(password) < 8 {
		return errors.NewToUser("Password must be atleast 8 chars long.")
	}

	// make hash
	newHash, err := userService.authService.HashPassword(password)
	if err != nil {
		return err
	}

	// update database
	err = userService.userRepo.UpdatePassword(id, newHash)
	if err != nil {
		return err
	}

	return nil
}
