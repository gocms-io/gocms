package services

import (
	"gopkg.in/gomail.v2"
	"github.com/menklab/goCMS/config"
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
		Dialer: gomail.NewDialer(config.SMTPServer, int(config.SMTPPort), config.SMTPUser, config.SMTPPassword),
		From: config.SMTPFromAddress,
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
	if !config.SMTPSimulate {
		err := ms.Dialer.DialAndSend(m)
		if err != nil {
			log.Print("Error sending mail: " + err.Error())
		}
	} else {
		log.Print("Email simulated: " + mail.Body)
	}

	return nil
}
