package goCMS_models

import (
	"time"
)

type Email struct {
	Id         int       `db:"id"`
	UserId     int       `db:"userId"`
	Email      string    `db:"email"`
	IsVerified bool      `db:"isVerified"`
	IsPrimary  bool      `db:"isPrimary"`
	Created    time.Time `db:"created"`
}

/**
* @apiDefine EmailDisplay
* @apiSuccess (Response) {number} id
* @apiSuccess (Response) {string} email
* @apiSuccess (Response) {number} verified
* @apiSuccess (Response) {number} isPrimary
 */
type EmailDisplay struct {
	Id        int    `json:"id,omitempty"`
	Email     string `json:"email,omitempty"`
	Verified  bool   `json:"verified"`
	IsPrimary bool   `json:"isPrimary"`
}

/**
* @apiDefine EmailInput
* @apiParam (Request) {string} password The current users password.
* @apiParam (Request) {string} email The new email to add, promote, or delete.
 */
type EmailInput struct {
	Password string `json:"password,omitempty"`
	Email    string `json:"email"`
}

/**
* @apiDefine RequestEmailActivationLink
* @apiParam (Request) {string} email The email to send the activation link to.
 */
type RequestEmailActivationLinkInput struct {
	Email string `json:"email"`
}

func (e *Email) GetEmailDisplay() *EmailDisplay {
	em := EmailDisplay{
		Email:     e.Email,
		Id:        e.Id,
		IsPrimary: e.IsPrimary,
		Verified:  e.IsVerified,
	}
	return &em
}
