package timeUtil

import "time"

var MYSQL_TIME_STAMP_FORMAT = "2006-01-02 15:04:05"
var INPUT_DATETIME_STAMP_FORMAT = "01-02-2006 15:04:05"
var INPUT_TIME_STAMP_FORMAT = "15:04:05"
var INPUT_DATE_STAMP_FORMAT = "01-02-2006"

// for available timezones see
// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

func init() {
	// verify timezone file exists on launch or fail
	_, err := time.LoadLocation("US/Eastern")
	if err != nil {
		panic(err)
	}
}

// RoundToDay rounds time stamp to the nearest day
func RoundToDay(current time.Time) (rounded time.Time) {
	return time.Date(current.Year(), current.Month(), current.Day(), 0, 0, 0, 0, current.Location())
}
