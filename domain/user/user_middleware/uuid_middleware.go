package user_middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/nu7hatch/gouuid"
	"github.com/gocms-io/gocms/utility/log"
)

func UUID() gin.HandlerFunc {
	log.Debugf("Adding UUID Middleware\n")
	return uuidMiddleware
}

func uuidMiddleware(c *gin.Context) {
	id, _ := uuid.NewV4()
	c.Set("uuid", id)
	c.Next()
}
