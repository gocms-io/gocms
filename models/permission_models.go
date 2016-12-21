package models

import "time"

type Permission struct {
	Id          int            `db:"id"`
	Name        string            `db:"name"`
	Description string `db:"description"`
	Created     time.Time      `db:"created"`
}
