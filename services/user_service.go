package services

import (
	"bitbucket.org/menklab/grnow-services/models"
	"bitbucket.org/menklab/grnow-services/repositories"
	"bitbucket.org/menklab/grnow-services/utility/errors"
)

type IUserService interface {
	Add(*models.User) error
	Get(int) (*models.User, error)
	GetByEmail(string) (*models.User, error)
	GetAll() (*[]models.User, error)
	Delete(int) error
	Update(int, *models.User) error
}

type UserService struct {
	userRepo       repositories.IUserRepository
	authService    IAuthService
	mailService    IMailService
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

	// if new password test it, hash it, save it, move on
	if userForUpdate.NewPassword != "" {
		if len(userForUpdate.NewPassword) < 8 {
			return errors.NewToUser("Password must be atleast 8 chars long.")
		}
		newHash, err := userService.authService.HashPassword(userForUpdate.NewPassword)
		if err != nil {
			return err
		}
		userForUpdate.Password = newHash
	}

	err := userService.userRepo.Update(id, userForUpdate)
	if err != nil {
		return err
	}

	return nil
}
