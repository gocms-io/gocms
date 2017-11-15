package email_service

import (
	"fmt"
	"github.com/gocms-io/gocms/context"
	"github.com/gocms-io/gocms/domain/acl/authentication/authentication_service"
	"github.com/gocms-io/gocms/domain/email/email_model"
	"github.com/gocms-io/gocms/domain/mail/mail_service"
	"github.com/gocms-io/gocms/domain/secure_code/security_code_model"
	"github.com/gocms-io/gocms/init/repository"
	"github.com/gocms-io/gocms/utility/errors"
	"time"
	"github.com/gocms-io/gocms/utility/log"
)

type IEmailService interface {
	SetVerified(email string) error
	GetVerified(email string) bool
	AddEmail(email *email_model.Email) error
	GetEmailsByUserId(userId int) ([]email_model.Email, error)
	SendEmailActivationCode(email string) error
	VerifyEmailActivationCode(id int, code string) bool
	PromoteEmail(email *email_model.Email) error
	DeleteEmail(email *email_model.Email) error
}

type EmailService struct {
	MailService       mail_service.IMailService
	AuthService       authentication_service.IAuthService
	RepositoriesGroup *repository.RepositoriesGroup
}

func DefaultEmailService(rg *repository.RepositoriesGroup, ms *mail_service.MailService, as *authentication_service.AuthService) *EmailService {
	emailService := &EmailService{
		RepositoriesGroup: rg,
		AuthService:       as,
		MailService:       ms,
	}
	return emailService
}

func (es *EmailService) SetVerified(e string) error {
	// get email
	email, err := es.RepositoriesGroup.EmailRepository.GetByAddress(e)
	if err != nil {
		return err
	}

	// set verified
	email.IsVerified = true
	err = es.RepositoriesGroup.EmailRepository.Update(email)
	if err != nil {
		return err
	}
	return err
}

func (es *EmailService) GetVerified(e string) bool {
	email, err := es.RepositoriesGroup.EmailRepository.GetByAddress(e)
	if err != nil {
		log.Errorf("Email Service, Get Verified, Error getting email by address: %s\n", err.Error())
		return false
	}

	return email.IsVerified
}

func (es *EmailService) AddEmail(e *email_model.Email) error {

	// check to see if email exist
	emailExists, _ := es.RepositoriesGroup.EmailRepository.GetByAddress(e.Email)
	if emailExists != nil {
		return errors.NewToUser("Email already exists.")
	}

	// add email
	err := es.RepositoriesGroup.EmailRepository.Add(e)
	if err != nil {
		log.Errorf("Email Service, error adding email: %s", err.Error())
		return err
	}

	// send email to primary email about addition of email
	if primaryEmail, err := es.RepositoriesGroup.EmailRepository.GetPrimaryByUserId(e.UserId); err == nil {
		mail := mail_service.Mail{
			To:       primaryEmail.Email,
			Subject:  "New Email Added To Your Account",
			Body:     "A new alternative email address, " + e.Email + ", was added to your account.\n\n If you believe this to be a mistake please contact support.",
			BodyHTML: fmt.Sprintf("<h1>Alternative Email Added</h1><h3>%v</h3><p>If you believe this to be a mistake please contact support.</p>", e.Email),
		}
		es.MailService.Send(&mail)
	}

	return nil
}

func (es *EmailService) SendEmailActivationCode(emailAddress string) error {

	// get userId from email
	email, err := es.RepositoriesGroup.EmailRepository.GetByAddress(emailAddress)
	if err != nil {
		log.Errorf("Error sending email activation code, get email: %s", err.Error())
		return err
	}

	if email.IsVerified {
		err = errors.NewToUser("Email already activated.")
		log.Errorf("Error sending email activation code, %s\n", err.Error())
		return err
	}

	// create reset code
	code, hashedCode, err := es.AuthService.GetRandomCode(32)
	if err != nil {
		log.Errorf("Error sending email activation code, get random code: %s\n", err.Error())
		return err
	}

	// update user with new code
	err = es.RepositoriesGroup.SecureCodeRepository.Add(&security_code_model.SecureCode{
		UserId: email.UserId,
		Type:   security_code_model.Code_VerifyEmail,
		Code:   hashedCode,
	})
	if err != nil {
		log.Errorf("Error sending email activation code, add secure code: %s\n", err.Error())
		return err
	}

	expTimeStr := time.Now().Add(time.Minute * time.Duration(context.Config.DbVars.EmailActivationTimeout)).Format("01/02/2006 03:04 pm")
	activationLink := fmt.Sprintf("%v/user/email/activate?code=%v&email=%v", context.Config.DbVars.PublicApiUrl, code, emailAddress)
	// send email
	es.MailService.Send(&mail_service.Mail{
		To:      emailAddress,
		Subject: "Account Verification Required",
		Body: "Click on the link below to activate your account:\n" +
			activationLink + "\n\nThe link will expire at: " +
			expTimeStr + ".",
		BodyHTML: fmt.Sprintf("<h1>Account Verification Required</h1><h2>Click on the link below to activate your account:</h2><p><a href='%v'>Activate Link</a></h3></p><p>The link will expire at: <b>%v</b></p>", activationLink, expTimeStr),
	})
	if err != nil {
		log.Errorf("Error sending email activation code, sending mail: " + err.Error())
	}

	return nil
}

func (es *EmailService) VerifyEmailActivationCode(id int, code string) bool {

	// get code
	secureCode, err := es.RepositoriesGroup.SecureCodeRepository.GetLatestForUserByType(id, security_code_model.Code_VerifyEmail)
	if err != nil {
		log.Errorf("error getting latest password reset code: %s", err.Error())
		return false
	}

	if ok := es.AuthService.VerifyPassword(secureCode.Code, code); !ok {
		return false
	}

	// check within time
	if time.Since(secureCode.Created) > (time.Minute * time.Duration(context.Config.DbVars.PasswordResetTimeout)) {
		return false
	}

	err = es.RepositoriesGroup.SecureCodeRepository.Delete(secureCode.Id)
	if err != nil {
		return false
	}

	return true
}

func (es *EmailService) PromoteEmail(email *email_model.Email) error {

	// get email for verification
	dbEmail, err := es.RepositoriesGroup.EmailRepository.GetByAddress(email.Email)
	if err != nil {
		log.Errorf("email service, promote email, get by address, error: %s", err.Error())
		return err
	}

	// verify email owner
	if email.UserId != dbEmail.UserId {
		err = errors.NewToUser("You can only promote email address owned by you.")
		log.Errorf("email service, promote email, get by address, error: %s", err.Error())
		return err
	}

	// email must be verified
	if !dbEmail.IsVerified {
		err = errors.NewToUser("You can only promote an email address after it has been validated.")
		log.Errorf("email service, promote email, get by address, error: %s", err.Error())
		return err
	}

	// get user primary email to send notification too first
	oldPrimaryEmail, err := es.RepositoriesGroup.EmailRepository.GetPrimaryByUserId(email.UserId)
	if err != nil {
		log.Errorf("email service, promote email, get primary by userId, error: %s", err.Error())
		return err
	}

	// promote email
	err = es.RepositoriesGroup.EmailRepository.PromoteEmail(dbEmail.Id, dbEmail.UserId)
	if err != nil {
		log.Errorf("email service, promote email, promoting email, errors:%s", err.Error())
		return err
	}

	// send notification
	// send email to primary email about addition of email
	mail := mail_service.Mail{
		To:       oldPrimaryEmail.Email,
		Subject:  "New Primary Email",
		Body:     "A new primary email address, " + email.Email + ", has been set on your account.\n\n If you believe this to be a mistake please contact support.",
		BodyHTML: fmt.Sprintf("<h1>New Primary Email</h1><p>A new primary email address has been set for your account:</p><h3>%v</h3><p>If you believe this to be a mistake please contact support.</p>", email.Email),
	}
	es.MailService.Send(&mail)

	return nil
}

func (es *EmailService) GetEmailsByUserId(userId int) ([]email_model.Email, error) {

	// get all emails
	emails, err := es.RepositoriesGroup.EmailRepository.GetByUserId(userId)
	if err != nil {
		log.Errorf("email service, get emails by user id, error: %s", err.Error())
		return nil, err
	}

	return emails, nil
}

func (es *EmailService) DeleteEmail(email *email_model.Email) error {

	// get email for verification
	dbEmail, err := es.RepositoriesGroup.EmailRepository.GetByAddress(email.Email)
	if err != nil {
		log.Errorf("email service, promote email, get by address, error: %s", err.Error())
		return err
	}

	// verify email owner
	if email.UserId != dbEmail.UserId {
		err = errors.NewToUser("You can only delete email address owned by you.")
		log.Errorf("email service, delete email, get by address, error: %s", err.Error())
		return err
	}

	// email cannot be primary
	if dbEmail.IsPrimary {
		err = errors.NewToUser("You can't delete the primary email address from an account.")
		log.Errorf("email service, delete email, get by address, error: %s", err.Error())
		return err
	}

	// delete email
	err = es.RepositoriesGroup.EmailRepository.Delete(dbEmail.Id)
	if err != nil {
		log.Errorf("email service, delete email, deleting email, errors:%s", err.Error())
		return err
	}

	// get user primary email to send notification too
	primaryEmail, err := es.RepositoriesGroup.EmailRepository.GetPrimaryByUserId(email.UserId)
	if err != nil {
		log.Errorf("email service, delete email, get primary by userId, error: %s", err.Error())
		return err
	}

	// send notification
	// send email to primary email about addition of email
	mail := mail_service.Mail{
		To:       primaryEmail.Email,
		Subject:  "Alternative Email Deleted",
		Body:     "An alternative email, " + email.Email + ", has been deleted from your account.\n\n If you believe this to be a mistake please contact support.",
		BodyHTML: fmt.Sprintf("<h1>Alternative Email Deleted</h1><p>An alternative email address has been deleted from your account:</p><h3>%v</h3><p>If you believe this to be a mistake please contact support.</p>", email.Email),
	}
	es.MailService.Send(&mail)

	return nil
}
