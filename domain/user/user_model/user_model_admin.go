package user_model

import (
	"time"
)

/**
* @apiDefine UserAdminDisplay
* @apiSuccess (Response) {number} id
* @apiSuccess (Response) {string} fullName
* @apiSuccess (Response) {string} email
* @apiSuccess (Response) {number} gender 1=male, 2=female
* @apiSuccess (Response) {boolean} enabled true is the user is enabled
* @apiSuccess (Response) {boolean} verified true is the user has verified their primary email address
* @apiSuccess (Response) {number} minAge
* @apiSuccess (Response) {number} maxAge
* @apiSuccess (Response) {string} created
* @apiSuccess (Response) {string} lastModified
 */
type UserAdminDisplay struct {
	Id           int64     `json:"id,omitempty"`
	FullName     string    `json:"fullName,omitempty"`
	Email        string    `json:"email,omitempty"`
	Verified     bool      `json:"verified,omitempty"`
	Gender       int64     `json:"gender,omitempty"`
	Photo        string    `json:"photo,string,omitempty"`
	Enabled      bool      `json:"enabled,omitempty"`
	MinAge       int64     `json:"minAge,omitempty"`
	MaxAge       int64     `json:"maxAge,omitempty"`
	Created      time.Time `json:"created,omitempty"`
	LastModified time.Time `json:"lastModified,omitempty"`
}

// helper function to get userAdminDisplay from user object
func (user *User) GetUserAdminDisplay() *UserAdminDisplay {
	userAdminDisplay := UserAdminDisplay{
		Id:           user.Id,
		Email:        user.Email,
		FullName:     user.FullName,
		Gender:       user.Gender,
		Photo:        user.Photo,
		Enabled:      user.Enabled,
		Verified:     user.Verified,
		Created:      user.Created,
		MaxAge:       user.MaxAge,
		MinAge:       user.MinAge,
		LastModified: user.LastModified,
	}
	return &userAdminDisplay
}
