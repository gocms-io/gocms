package services

import (
	"gopkg.in/gomail.v2"
	"github.com/menklab/goCMS/config"
	"github.com/menklab/goCMS/utility"
)

type IMailService interface {
	Send(*Mail) error
}

type MailService struct {
	Dialer *gomail.Dialer
	From   string
}

type Mail struct {
	To      string
	Subject string
	Body    string
}

var mailService *MailService

func init() {
	mailService = &MailService{
		Dialer: gomail.NewDialer(config.SMTPServer, int(config.SMTPPort), config.SMTPUser, config.SMTPPassword),
		From: config.SMTPFromAddress,
	}
}

func (ms *MailService) Send(mail *Mail) error {

	m := gomail.NewMessage()
	m.SetHeader("From", mailService.From)
	m.SetHeader("To", mail.To)
	m.SetHeader("Subject", mail.Subject)
	m.SetBody("text/plain", mail.Body)

	// Send the email
	if !config.SMTPSimulate {
		err := mailService.Dialer.DialAndSend(m)
		if err != nil {
			utility.Debug("Error sending mail: " + err.Error())
		}
	} else {
		utility.Debug("Email simulated: " + mail.Body)
	}

	return nil
}
