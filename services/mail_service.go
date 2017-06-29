package services

import (
	"fmt"
	"github.com/gocms-io/gocms/context"
	"gopkg.in/gomail.v2"
	"io"
	"log"
	"path/filepath"
	"text/template"
	"time"
)

type IMailService interface {
	Send(*Mail) error
}

type MailService struct {
	Dialer          *gomail.Dialer
	From            string
	DefaultTemplate *template.Template
}

type Mail struct {
	To       string
	Subject  string
	Body     string
	BodyHTML string
}

func DefaultMailService() *MailService {
	defaultTemplatePath := filepath.Join("./content/themes", context.Config.ActiveTheme, "theme_email.tmpl")
	defaultTemplate := template.Must(template.ParseGlob(defaultTemplatePath))

	mailService := &MailService{
		Dialer:          gomail.NewDialer(context.Config.SMTPServer, int(context.Config.SMTPPort), context.Config.SMTPUser, context.Config.SMTPPassword),
		From:            context.Config.SMTPFromAddress,
		DefaultTemplate: defaultTemplate,
	}

	return mailService

}

func (ms *MailService) Send(mail *Mail) error {

	if mail.BodyHTML == "" {
		mail.BodyHTML = mail.Body
	}

	htmlData := map[string]string{
		"subject":     mail.Subject,
		"message":     mail.BodyHTML,
		"year":        time.Now().Format("2006"),
		"headerImage": fmt.Sprintf("http://static.gocms.io/default_assets/default_email_img.jpg"),
	}

	m := gomail.NewMessage()
	m.SetHeader("From", ms.From)
	m.SetHeader("To", mail.To)
	m.SetHeader("Subject", mail.Subject)
	m.SetBody("text/plain", mail.Body)
	m.AddAlternativeWriter("text/html", func(w io.Writer) error {
		err := ms.DefaultTemplate.Execute(w, htmlData)
		if err != nil {
			fmt.Printf("Error adding alt writter to html email: %v\n", err.Error())
		}
		return err
	})

	// Send the email
	if !context.Config.SMTPSimulate {
		err := ms.Dialer.DialAndSend(m)
		if err != nil {
			log.Print("Error sending mail: " + err.Error())
		}
	} else {
		log.Print("Email simulated: " + mail.Body)
	}

	return nil
}
