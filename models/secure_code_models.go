package goCMS_models

import "time"

type SecureCodeType int

const (
	Code_VerifyEmail   SecureCodeType = 1
	Code_VerifyDevice  SecureCodeType = 2
	Code_ResetPassword SecureCodeType = 3
)

type SecureCode struct {
	Id      int            `db:"id"`
	UserId  int            `db:"userId"`
	Type    SecureCodeType `db:"type"`
	Code    string         `db:"code"`
	Created time.Time      `db:"created"`
}
