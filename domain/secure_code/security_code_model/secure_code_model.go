package security_code_model

import "time"

type SecureCodeType int64

const (
	Code_VerifyEmail   SecureCodeType = 1
	Code_VerifyDevice  SecureCodeType = 2
	Code_ResetPassword SecureCodeType = 3
)

type SecureCode struct {
	Id      int64          `db:"id"`
	UserId  int64          `db:"userId"`
	Type    SecureCodeType `db:"type"`
	Code    string         `db:"code"`
	Created time.Time      `db:"created"`
}
