package user_middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/utility/log"
	"time"
)

const TIMEZONE_MIDDLEWARE_KEY = "TIMEZONE_MIDDLEWARE_KEY"

// Timezone setups the default timezone middleware
// to extract a timezone out of the header or default to Local
// utilize timezones as defined here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
func Timezone() gin.HandlerFunc {
	return timezoneMiddleware
}

// GetTimezoneFromContext gets the timezone set in the request context.
func GetTimezoneFromContext(c *gin.Context) (*time.Location, bool) {
	// get timezone from context
	if timezone, ok := c.Get("TIMEZONE_MIDDLEWARE_KEY"); ok {
		if value, ok := timezone.(time.Location); ok {
			return &value, true
		}
	}
	// if error get local and return
	local, _ := time.LoadLocation("Local")
	return local, false
}

func timezoneMiddleware(c *gin.Context) {
	timezoneHeader := c.Request.Header.Get("X-TIMEZONE")
	if timezoneHeader == "" {
		timezoneHeader = "Local"
	}
	timezone, err := time.LoadLocation(timezoneHeader)
	if err != nil {
		log.Errorf("Error parsing timezone header %v: %v\n", timezoneHeader, err)
		timezone, _ = time.LoadLocation("Local")
	}
	c.Set(TIMEZONE_MIDDLEWARE_KEY, *timezone)
	c.Next()
}
