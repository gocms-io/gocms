package services

import (
	"github.com/menklab/goCMS/repositories"
)

type IEmailService interface {
	SetVerified(string) error
}

type EmailService struct {
	RepositoriesGroup *repositories.RepositoriesGroup
}


func DefaultEmailService(rg *repositories.RepositoriesGroup) *EmailService {
	emailService := &EmailService{
		RepositoriesGroup: rg,
	}
	return emailService
}

func (es *EmailService) SetVerified (e string) error {
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