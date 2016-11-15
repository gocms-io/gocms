package models

import (
	"time"
)

type User struct {
	Id              int       `json:"id,string" db:"id"`
	FullName        string    `json:"fullName,omitempty" binding:"required" db:"fullName"`
	Email           string    `json:"email,omitempty" binding:"required" db:"email"`
	Email2          string    `json:"email2,omitempty" db:"email2"`
	Password        string    `json:"-" db:"password"`
	ConfirmPassword string    `json:"confirmPassword,omitempty"`
	NewPassword     string    `json:"newPassword,omitempty"`
	Created         time.Time `json:"created,omitempty" db:"created"`
}
