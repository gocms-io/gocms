package user_model

import (
	"github.com/gocms-io/gocms/domain/acl/group/group_model"
	"github.com/gocms-io/gocms/domain/acl/permissions/permission_model"
	"github.com/gocms-io/gocms/domain/email/email_model"
	"time"
)

var GENDER_UNKNOWN = 0
var GENDER_MALE = 1
var GENDER_FEMALE = 2

// TODO remove user json binding and create a user input.
type User struct {
	Id           int    `json:"id" db:"id"`
	FullName     string `json:"fullName" db:"fullName"`
	Email        string `json:"email" db:"email"`
	Verified     bool   `json:"isVerified" db:"isVerified"`
	AltEmails    []email_model.Email
	Password     string    `json:"password" db:"password"`
	Gender       int       `json:"gender" db:"gender"`
	Photo        string    `json:"photo" db:"photo"`
	MinAge       int       `json:"minAge" db:"minAge"`
	MaxAge       int       `json:"maxAge" db:"maxAge"`
	Created      time.Time `json:"created" db:"created"`
	Enabled      bool      `json:"enabled" db:"enabled"`
	LastModified time.Time `json:"lastModified" db:"lastModified"`
	Permissions  []*permission_model.Permission
	Groups       []*group_model.Group
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

// helper function to get userContextHeader from user object
func (user *User) GetUserContextHeader() *UserContextHeader {
	userDisplay := UserContextHeader{
		Id:           user.Id,
		Email:        user.Email,
		FullName:     user.FullName,
		ACL: user.GetUserAclPermissionsAndGroups(),
	}
	return &userDisplay
}
