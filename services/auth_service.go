package services

import (
	"golang.org/x/crypto/bcrypt"
	"time"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/utility/errors"
	"github.com/menklab/goCMS/config"
)

type IAuthService interface {
	AuthUser(*AuthUser) (*models.User, bool)
	HashPassword(string) (string, error)
	SendPasswordResetCode(string) error
	VerifyPassword(string, string) bool
	VerifyPasswordResetCode(int, string) bool
        SendTwoFactorCode(*models.User) error
	VerifyTwoFactorCode(id int, code string) bool
}

type AuthUser struct {
	Id       int
	Email    string
	Password string
}

type AuthService struct {
	userRepo       repositories.IUserRepository
	mailService    IMailService
	secureCodeRepo repositories.ISecureCodeRepository
}

var authService *AuthService

func init() {
	authService = &AuthService{
		mailService: new(MailService),
		userRepo: new(repositories.UserRepository),
		secureCodeRepo: new(repositories.SecureCodeRepository),
	}


}

func (self *AuthService) AuthUser(authUser *AuthUser) (*models.User, bool) {

	var dbUser *models.User
	var err error
	// get user by id
	if authUser.Id != 0 {
		dbUser, err = authService.userRepo.Get(authUser.Id)
	} else if authUser.Email != "" {
		dbUser, err = authService.userRepo.GetByEmail(authUser.Email)

	} else {
		err = errors.New("You must provide an Id or Email")
	}
	if err != nil {
		utility.Debug("Error authing user: " + err.Error())
		return nil, false
	}



	// check password
	if ok := authService.VerifyPassword(dbUser.Password, authUser.Password); !ok {
		return nil, false
	}

	return dbUser, true
}

func (self *AuthService) VerifyPassword(passwordHash string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password))
	if err != nil {
		return false
	}

	return true
}

func (self *AuthService) VerifyPasswordResetCode(id int, code string) bool {

	// get code
	secureCode, err := authService.secureCodeRepo.GetLatestForUserByType(id, models.Code_ResetPassword)
	if err != nil {
		return false
	}

	if ok := authService.VerifyPassword(secureCode.Code, code); !ok {
		return false
	}


	// check within time
	if time.Since(secureCode.Created) > (time.Minute * time.Duration(config.PasswordResetTimeout)) {
		return false
	}

	// at this point the code is good and we must respond this way... yet we want to null out the code so it can't be used again
	// create code
	_, hashedCode, err := authService.getRandomCode(32)
	if err != nil {
		return false
	}

	err = authService.secureCodeRepo.Add(&models.SecureCode{
		UserId: id,
		Type:   models.Code_ResetPassword,
		Code:   hashedCode,
	})
	if err != nil {
		return false
	}

	return true
}

func (self *AuthService) SendPasswordResetCode(email string) error {

	// get user
	user, err := authService.userRepo.GetByEmail(email)
	if err != nil {
		return err
	}

	// create reset code
	code, hashedCode, err := authService.getRandomCode(32)
	if err != nil {
		return err
	}

	// update user with new code
	err = authService.secureCodeRepo.Add(&models.SecureCode{
		UserId: user.Id,
		Type:   models.Code_ResetPassword,
		Code:   hashedCode,
	})
	if err != nil {
		return err
	}

	// send email
	authService.mailService.Send(&Mail{
		To:      user.Email,
		Subject: "Password Reset Requested",
		Body: "To reset your password enter the code below into the app:\n" +
			code + "\n\nThe code will expire at: " +
			time.Now().Add(time.Minute * time.Duration(config.PasswordResetTimeout)).String() + ".",
	})
	if err != nil {
		utility.Debug("Error sending mail: " + err.Error())
	}

	return nil
}

func (self *AuthService) SendTwoFactorCode(user *models.User) error {

	// create code
	code, hashedCode, err := authService.getRandomCode(8)
	if err != nil {
		return err
	}


	// update user with new code
	err = authService.secureCodeRepo.Add(&models.SecureCode{
		UserId: user.Id,
		Type:   models.Code_VerifyDevice,
		Code:   hashedCode,
	})
	if err != nil {
		return err
	}

	// send email
	authService.mailService.Send(&Mail{
		To:      user.Email,
		Subject: "Device Verification",
		Body:    "Your verification code is: " + code + "\n\nThe code will expire at: " + time.Now().Add(time.Minute * time.Duration(config.TwoFactorCodeTimeout)).String() + ".",
	})
	if err != nil {
		utility.Debug("Error sending mail: " + err.Error())
	}

	return nil
}

func (self *AuthService) VerifyTwoFactorCode(id int, code string) bool {

	// get code from db
	secureCode, err := authService.secureCodeRepo.GetLatestForUserByType(id, models.Code_VerifyDevice)
	if err != nil {
		return false
	}

	// check code
	if ok := authService.VerifyPassword(secureCode.Code, code); !ok {
		return false
	}

	// check within time
	if time.Since(secureCode.Created) > (time.Minute * time.Duration(config.TwoFactorCodeTimeout)) {
		return false
	}

	// at this point the code is good and we must respond this way... yet we want to null out the code so it can't be used again
	// create code
	_, hashedCode, err := authService.getRandomCode(8)
	if err != nil {
		return false
	}

	err = authService.secureCodeRepo.Add(&models.SecureCode{
		UserId: id,
		Type:   models.Code_VerifyDevice,
		Code:   hashedCode,
	})
	if err != nil {
		return false
	}

	return true
}

func (self *AuthService) HashPassword(password string) (string, error) {

	bPassword := []byte(password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bPassword, bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func (self *AuthService) getRandomCode(length int) (string, string, error) {
	// create code
	code, err := utility.GenerateRandomString(length)
	if err != nil {
		return "", "", err
	}

	// hash code for saving in db
	hashedCode, err := authService.HashPassword(code)
	if err != nil {
		return "", "", err
	}

	return code, hashedCode, nil
}
