package goCMS_services

import (
	"github.com/menklab/goCMS/context"
	"gopkg.in/gomail.v2"
	"log"
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

func DefaultMailService() *MailService {
	mailService := &MailService{
		Dialer: gomail.NewDialer(goCMS_context.Config.SMTPServer, int(goCMS_context.Config.SMTPPort), goCMS_context.Config.SMTPUser, goCMS_context.Config.SMTPPassword),
		From:   goCMS_context.Config.SMTPFromAddress,
	}

	return mailService

}

func (ms *MailService) Send(mail *Mail) error {

	m := gomail.NewMessage()
	m.SetHeader("From", ms.From)
	m.SetHeader("To", mail.To)
	m.SetHeader("Subject", mail.Subject)
	m.SetBody("text/plain", mail.Body)

	// Send the email
	if !goCMS_context.Config.SMTPSimulate {
		err := ms.Dialer.DialAndSend(m)
		if err != nil {
			log.Print("Error sending mail: " + err.Error())
		}
	} else {
		log.Print("Email simulated: " + mail.Body)
	}

	return nil
}
