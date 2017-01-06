package models

import (
	"time"
)

type Email struct {
	Id        int       `db:"id"`
	UserId    string    `db:"userId"`
	Email     string    `db:"email"`
	Verified  bool      `db:"verified"`
	IsPrimary bool      `db:"isPrimary"`
	Created   time.Time   `db:"created"`
}

type EmailDisplay struct {
	Id        int       `json:"id,omitempty"`
	Email     string    `json:"email,omitempty"`
	Verified  bool      `json:"verified,omitempty"`
	IsPrimary bool      `json:"isPrimary,omitempty"`
}

/**
* @apiDefine AddEmailInput
* @apiParam (Request) {string} password The current users password.
* @apiParam (Request) {string} email The new email to add.
*/
type AddEmailInput struct {
	Password string    `json:"password,omitempty"`
	Email    string       `json:"email"`
}

func (e *Email) GetEmailDisplay() *EmailDisplay {
	em := EmailDisplay{
		Email: e.Email,
		Id: e.Id,
		IsPrimary: e.IsPrimary,
		Verified: e.Verified,
	}
	return &em
}

