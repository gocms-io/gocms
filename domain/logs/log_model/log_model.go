package log_model

import (
	"time"
)

/**
* @apiDefine ErrorLog
* @apiSuccess (Response) {string} route
* @apiSuccess (Response) {string} status
* @apiSuccess (Response) {string} body
* @apiSuccess (Response) {string} time
**/
type ErrorLog struct {
	route  string  `json:"route" db:"route"`
	status string  `json:"status" db:"status"`
	body   string  `json:"body" db:"body"`
	time   time.Time  `json:"time" db:"time"`
}