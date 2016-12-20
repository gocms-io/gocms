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
	Email2          string    `db:"email2"`
	Password        string    `db:"password"`
	Gender          int       `db:"gender"`
	Photo           string    `db:"photo"`
	MinAge          int       `db:"minAge"`
	MaxAge          int       `db:"maxAge"`
	Created         time.Time `db:"created"`
	IsAdmin         bool      `db:"isAdmin"`
}

// helper function to get userDisplay from user object
func (user *User) GetUserDisplay() UserDisplay {
	return UserDisplay{
		Id: user.Id,
		Email: user.Email,
		Email2: user.Email2,
		FullName: user.FullName,
		Gender: user.Gender,
		Photo: user.Photo,
		IsAdmin: user.IsAdmin,
	}
}

/**
* @apiDefine UserDisplay
* @apiSuccess (Response) {number} id
* @apiSuccess (Response) {string} fullName
* @apiSuccess (Response) {string} email
* @apiSuccess (Response) {string} email2
* @apiSuccess (Response) {number} gender 1=male, 2=female
* @apiSuccess (Response) {boolean} isAdmin
*/
type UserDisplay struct {
	Id              int       `json:"id,omitempty"`
	FullName        string    `json:"fullName,omitempty"`
	Email           string    `json:"email,omitempty"`
	Email2          string    `json:"email2,omitempty"`
	Gender          int       `json:"gender,omitempty"`
	Photo           string    `json:"photo,string,omitempty"`
	IsAdmin         bool      `json:"isAdmin, omitempty"`
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
