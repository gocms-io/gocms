package models

import (
	"time"
)

var GENDER_UNKNOWN = 0
var GENDER_MALE = 1
var GENDER_FEMALE = 2

type User struct {
	Id           int    `db:"id"`
	FullName     string `db:"fullName"`
	Email        string `db:"email"`
	Verified     bool   `db:"isVerified"`
	AltEmails    []Email
	Password     string    `db:"password"`
	Gender       int       `db:"gender"`
	Photo        string    `db:"photo"`
	MinAge       int       `db:"minAge"`
	MaxAge       int       `db:"maxAge"`
	Created      time.Time `db:"created"`
	Enabled      bool      `db:"enabled"`
	LastModified time.Time `db:"lastModified"`
}

/**
* @apiDefine UserDisplay
* @apiSuccess (Response) {number} id
* @apiSuccess (Response) {string} fullName
* @apiSuccess (Response) {string} email
* @apiSuccess (Response) {number} gender 1=male, 2=female
* @apiSuccess (Response) {string} photo url string
* @apiSuccess (Response) {string} lastModified
 */
type UserDisplay struct {
	Id           int       `json:"id,omitempty"`
	FullName     string    `json:"fullName,omitempty"`
	Email        string    `json:"email,omitempty"`
	Gender       int       `json:"gender,omitempty"`
	Photo        string    `json:"photo,string,omitempty"`
	LastModified time.Time `json:"lastModified,omitempty"`
}

/**
* @apiDefine UserUpdateInput
* @apiParam (Request) {string} fullName
* @apiParam (Request) {number} gender 1=male, 2=female
 */
type UserUpdateInput struct {
	FullName string `json:"fullName,omitempty"`
	Gender   int    `json:"gender"`
}

/**
* @apiDefine UserChangePasswordInput
* @apiParam (Request) {string} password The current users password.
* @apiParam (Request) {string} newPassword
 */
type UserChangePasswordInput struct {
	Password    string `json:"password,omitempty"`
	NewPassword string `json:"newPassword,omitempty"`
}

/**
* @apiDefine UserPasswordInput
* @apiParam (Request) {string} password The current users password.
 */
type UserPasswordInput struct {
	Password string `json:"password,omitempty"`
}

// helper function to get userDisplay from user object
func (user *User) GetUserDisplay() *UserDisplay {
	userDisplay := UserDisplay{
		Id:           user.Id,
		Email:        user.Email,
		FullName:     user.FullName,
		Gender:       user.Gender,
		Photo:        user.Photo,
		LastModified: user.LastModified,
	}
	return &userDisplay
}
