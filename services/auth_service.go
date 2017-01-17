package services

import (
	"golang.org/x/crypto/bcrypt"
	"time"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/repositories"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/config"
	"log"
	"github.com/nbutton23/zxcvbn-go"
)

type IAuthService interface {
	AuthUser(string, string) (*models.User, bool)
	HashPassword(string) (string, error)
	SendPasswordResetCode(string) error
	VerifyPassword(string, string) bool
	VerifyPasswordResetCode(int, string) bool
        SendTwoFactorCode(*models.User) error
	VerifyTwoFactorCode(int, string) bool
	PasswordIsComplex(string) bool
	GetRandomCode(int) (string, string, error)
}


type AuthService struct {
	MailService       IMailService
	RepositoriesGroup *repositories.RepositoriesGroup
}


func DefaultAuthService(rg *repositories.RepositoriesGroup, mailService *MailService) *AuthService{
	authService := &AuthService{
		MailService: mailService,
		RepositoriesGroup: rg,
	}
	
	return authService

}

func (as *AuthService) AuthUser(email string, password string) (*models.User, bool) {

	var dbUser *models.User
	var err error
		dbUser, err = as.RepositoriesGroup.UsersRepository.GetByEmail(email)

	if err != nil {
		log.Print("Error authing user: " + err.Error())
		return nil, false
	}



	// check password
	if ok := as.VerifyPassword(dbUser.Password, password); !ok {
		return nil, false
	}

	return dbUser, true
}

func (as *AuthService) VerifyPassword(passwordHash string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password))
	if err != nil {
		log.Printf("Error comparing hashes: %s", err.Error())
		return false
	}

	return true
}

func (as *AuthService) VerifyPasswordResetCode(id int, code string) bool {

	// get code
	secureCode, err := as.RepositoriesGroup.SecureCodeRepository.GetLatestForUserByType(id, models.Code_ResetPassword)
	if err != nil {
		log.Printf("error getting latest password reset code: %s", err.Error())
		return false
	}

	if ok := as.VerifyPassword(secureCode.Code, code); !ok {
		return false
	}


	// check within time
	if time.Since(secureCode.Created) > (time.Minute * time.Duration(config.PasswordResetTimeout)) {
		return false
	}

	err = as.RepositoriesGroup.SecureCodeRepository.Delete(secureCode.Id)
	if err != nil {
		return false
	}

	return true
}



func (as *AuthService) SendPasswordResetCode(email string) error {

	// get user
	user, err := as.RepositoriesGroup.UsersRepository.GetByEmail(email)
	if err != nil {
		return err
	}

	// create reset code
	code, hashedCode, err := as.GetRandomCode(6)
	if err != nil {
		return err
	}

	// update user with new code
	err = as.RepositoriesGroup.SecureCodeRepository.Add(&models.SecureCode{
		UserId: user.Id,
		Type:   models.Code_ResetPassword,
		Code:   hashedCode,
	})
	if err != nil {
		return err
	}

	// send email
	as.MailService.Send(&Mail{
		To:      user.Email,
		Subject: "Password Reset Requested",
		Body: "To reset your password enter the code below into the app:\n" +
			code + "\n\nThe code will expire at: " +
			time.Now().Add(time.Minute * time.Duration(config.PasswordResetTimeout)).String() + ".",
	})
	if err != nil {
		log.Print("Error sending mail: " + err.Error())
	}

	return nil
}



func (as *AuthService) SendTwoFactorCode(user *models.User) error {

	// create code
	code, hashedCode, err := as.GetRandomCode(8)
	if err != nil {
		return err
	}


	// update user with new code
	err = as.RepositoriesGroup.SecureCodeRepository.Add(&models.SecureCode{
		UserId: user.Id,
		Type:   models.Code_VerifyDevice,
		Code:   hashedCode,
	})
	if err != nil {
		return err
	}

	// send email
	as.MailService.Send(&Mail{
		To:      user.Email,
		Subject: "Device Verification",
		Body:    "Your verification code is: " + code + "\n\nThe code will expire at: " + time.Now().Add(time.Minute * time.Duration(config.TwoFactorCodeTimeout)).String() + ".",
	})
	if err != nil {
		log.Print("Error sending mail: " + err.Error())
	}

	return nil
}

func (as *AuthService) VerifyTwoFactorCode(id int, code string) bool {

	// get code from db
	secureCode, err := as.RepositoriesGroup.SecureCodeRepository.GetLatestForUserByType(id, models.Code_VerifyDevice)
	if err != nil {
		return false
	}

	// check code
	if ok := as.VerifyPassword(secureCode.Code, code); !ok {
		return false
	}

	// check within time
	if time.Since(secureCode.Created) > (time.Minute * time.Duration(config.TwoFactorCodeTimeout)) {
		return false
	}

	err = as.RepositoriesGroup.SecureCodeRepository.Delete(secureCode.Id)
	if err != nil {
		return false
	}

	return true
}

func (as *AuthService) HashPassword(password string) (string, error) {

	bPassword := []byte(password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bPassword, bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func (as *AuthService) GetRandomCode(length int) (string, string, error) {
	// create code
	code, err := utility.GenerateRandomString(length)
	if err != nil {
		return "", "", err
	}

	// hash code for saving in db
	hashedCode, err := as.HashPassword(code)
	if err != nil {
		return "", "", err
	}

	return code, hashedCode, nil
}

func (as *AuthService) PasswordIsComplex(password string) bool {
	userInputs := []string{}
	score := zxcvbn.PasswordStrength(password, userInputs)
	if score.Score < int(config.PasswordComplexity) {
		return false
	}
	return true
}