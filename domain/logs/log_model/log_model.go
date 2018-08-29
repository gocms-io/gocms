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
	Route  string  `json:"route" db:"route"`
	Status string  `json:"status" db:"status"`
	Body   string  `json:"body" db:"body"`
	Time   time.Time  `json:"date" db:"date"`
}