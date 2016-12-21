package models

import (
	"time"
)

var GENDER_UNKNOWN = 0
var GENDER_MALE = 1
var GENDER_FEMALE = 2

type User struct {
	Id              int       `db:"id"`
	FullName        string    `db:"fullName"`
	Email           string    `db:"email"`
	Password        string    `db:"password"`
	Gender          int       `db:"gender"`
	Photo           string    `db:"photo"`
	MinAge          int       `db:"minAge"`
	MaxAge          int       `db:"maxAge"`
	Created         time.Time `db:"created"`
	Enabled         bool      `db:"enabled"`
	Verified         bool      `db:"verified"`
}

/**
* @apiDefine UserDisplay
* @apiSuccess (Response) {number} id
* @apiSuccess (Response) {string} fullName
* @apiSuccess (Response) {string} email
* @apiSuccess (Response) {number} gender 1=male, 2=female
*/
type UserDisplay struct {
	Id       int       `json:"id,omitempty"`
	FullName string    `json:"fullName,omitempty"`
	Email    string    `json:"email,omitempty"`
	Gender   int       `json:"gender,omitempty"`
	Photo    string    `json:"photo,string,omitempty"`
}

/**
* @apiDefine UserUpdateInput
* @apiParam (Request) {string} fullName
* @apiParam (Request) {number} gender 1=male, 2=female
*/
type UserUpdateInput struct {
	FullName string    `json:"fullName,omitempty" db:"fullName"`
	Gender   int       `json:"gender" db:"gender"`
}

/**
* @apiDefine UserUpdateInput
* @apiParam (Request) {string} currentPassword
* @apiParam (Request) {string} newPassword
*/
type UserChangePasswordInput struct {
	CurrentPassword string    `json:"currentPassword,omitempty"`
	NewPassword     string    `json:"newPassword,omitempty"`
}

// helper function to get userDisplay from user object
func (user *User) GetUserDisplay() *UserDisplay {
	userDisplay := UserDisplay{
		Id: user.Id,
		Email: user.Email,
		FullName: user.FullName,
		Gender: user.Gender,
		Photo: user.Photo,
	}
	return &userDisplay
}