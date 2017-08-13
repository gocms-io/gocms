package timeUtil

import "time"

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
