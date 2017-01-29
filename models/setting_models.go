package models

import "time"

type Setting struct {
	Id          int            `db:"id"`
	Name        string            `db:"name"`
	Value        string            `db:"value"`
	Description string `db:"description"`
	Created     time.Time      `db:"created"`
}



