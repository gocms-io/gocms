package models

import (
	"time"
)

var GENDER_UNKNOWN = 0
var GENDER_MALE = 1
var GENDER_FEMALE = 2

type User struct {
	Id              int       `json:"id,string" db:"id"`
	FullName        string    `json:"fullName,omitempty" binding:"required" db:"fullName"`
	Email           string    `json:"email,omitempty" binding:"required" db:"email"`
	Email2          string    `json:"email2,omitempty" db:"email2"`
	Password        string    `json:"-" db:"password"`
	Gender          int       `json:"gender,string" db:"gender"`
	Photo           string       `json:"photo,string" db:"photo"`
	MinAge  int       `json:"minAge,string" db:"minAge"`
	MaxAge  int       `json:"maxAge,string" db:"maxAge"`
	ConfirmPassword string    `json:"confirmPassword,omitempty"`
	NewPassword     string    `json:"newPassword,omitempty"`
	Created         time.Time `json:"created,omitempty" db:"created"`
	IsAdmin         bool      `json:"isAdmin, omitempty" db:"isAdmin"`
}