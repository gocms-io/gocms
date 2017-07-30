package runtime_models

import "time"

type Runtime struct {
	Id           int       `db:"id"`
	Name         string    `db:"name"`
	Value        string    `db:"value"`
	Description  string    `db:"description"`
	Created      time.Time `db:"created"`
	LastModified time.Time `db:"lastModified"`
}
