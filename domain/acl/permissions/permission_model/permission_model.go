package permission_model

import (
	"time"
)

// Permission base permission struct for database transactions
type Permission struct {
	Id                   int64     `db:"id"`
	Name                 string    `db:"name"`
	Description          string    `db:"description"`
	InheritedFromGroupId int64     `db:"inheritedFromGroupId"`
	Created              time.Time `db:"created"`
	LastModified         time.Time `db:"lastModified"`
}
