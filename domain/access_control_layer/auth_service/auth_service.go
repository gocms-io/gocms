package auth_service

import (
	"fmt"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/models"
	"github.com/gocms-io/gocms/repositories"
	"github.com/gocms-io/gocms/utility"
	"github.com/nbutton23/zxcvbn-go"
	"golang.org/x/crypto/bcrypt"
	"log"
	"time"
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

func DefaultAuthService(rg *repositories.RepositoriesGroup, mailService *MailService) *AuthService {
	authService := &AuthService{
		MailService:       mailService,
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
	if time.Since(secureCode.Created) > (time.Minute * time.Duration(context.Config.PasswordResetTimeout)) {
		return false
	}

	// check if users primary email needs to be activated
	emails, err := as.RepositoriesGroup.EmailRepository.GetByUserId(id)
	if err != nil {
		log.Printf("Verify password reset code, error getting primary email to check activation: %v\n", err.Error())
	} else {
		for _, email := range emails {
			// if primary email is not verified; verify it and enable user
			if email.IsPrimary && !email.IsVerified {
				email.IsVerified = true
				err := as.RepositoriesGroup.EmailRepository.Update(&email)
				if err != nil { // log error but don't fail
					log.Printf("Verify password reset code, error setting primary email to verified: %v\n", err.Error())
				} else { // email user to be nice
					mail := Mail{
						To:       email.Email,
						Subject:  "We Activated Your Account",
						Body:     "You successfully reset your password. We also noticed that your account had not yet been activated, so we activated it. You can now login to our system.\n\n Thanks.",
						BodyHTML: fmt.Sprintf("<h1>Password Reset & Account Activation</h1><p>You successfully reset your password.<br/><br/>We also noticed that your account had not yet been activated, so we activated it. You can now login!<br/><br/> Thanks.</p>"),
					}
					as.MailService.Send(&mail)
				}
			}
		}
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

	expireTimeStr := time.Now().Add(time.Minute * time.Duration(context.Config.PasswordResetTimeout)).Format("03:04 pm")

	// send email
	as.MailService.Send(&Mail{
		To:      user.Email,
		Subject: "Password Reset Requested",
		Body: "To reset your password enter the code below into the app:\n" +
			code + "\n\nThe code will expire at: " +
			expireTimeStr + ".",
		BodyHTML: fmt.Sprintf("<h1>Password Reset</h1><p>To reset your password enter the code below into the app:</p><h3>%v</h3><p>The code will expire at: <b>%v</b></p>", code, expireTimeStr),
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

	expireTimeStr := time.Now().Add(time.Minute * time.Duration(context.Config.TwoFactorCodeTimeout)).Format("03:04 pm")

	// send email
	as.MailService.Send(&Mail{
		To:       user.Email,
		Subject:  "Device Verification",
		Body:     "Your verification code is: " + code + "\n\nThe code will expire at: " + expireTimeStr + ".",
		BodyHTML: fmt.Sprintf("<h1>Verification Code</h1><p>Your verification code is: </p><h3>%v</h3><p>The code will expire at: <b>%v</b></p>", code, expireTimeStr),
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
	if time.Since(secureCode.Created) > (time.Minute * time.Duration(context.Config.TwoFactorCodeTimeout)) {
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
	if score.Score < int(context.Config.PasswordComplexity) {
		return false
	}
	return true
}
