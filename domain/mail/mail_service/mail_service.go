package mail_service

import (
	"github.com/cqlcorp/gocms/context"
	"gopkg.in/gomail.v2"
	"io"
  "fmt" 
  
	"path/filepath"
	"text/template"
	"time"
	"github.com/cqlcorp/gocms/context"
	"github.com/cqlcorp/gocms/utility/log"
	"gopkg.in/gomail.v2"
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
	defaultTemplatePath := filepath.Join("./content/themes", context.Config.DbVars.ActiveTheme, "theme_email.tmpl")
	defaultTemplate := template.Must(template.ParseGlob(defaultTemplatePath))

	mailService := &MailService{
		Dialer:          gomail.NewDialer(context.Config.DbVars.SMTPServer, int(context.Config.DbVars.SMTPPort), context.Config.DbVars.SMTPUser, context.Config.DbVars.SMTPPassword),
		From:            context.Config.DbVars.SMTPFromAddress,
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
			log.Errorf("Error adding alt writter to html email: %v\n", err.Error())
		}
		return err
	})

	// Send the email
	if !context.Config.DbVars.SMTPSimulate {
		err := ms.Dialer.DialAndSend(m)
		if err != nil {
			log.Errorf("Error sending mail: " + err.Error())
		}
	} else {
		log.Debugf("Email simulated: " + mail.Body)
	}

	return nil
}
