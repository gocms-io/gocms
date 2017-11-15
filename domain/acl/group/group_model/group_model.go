package group_model

import "time"

type Group struct {
	Id           int64     `db:"id"`
	Name         string    `db:"name"`
	Description  string    `db:"description"`
	Created      time.Time `db:"created"`
	LastModified time.Time `db:"lastModified"`
}
