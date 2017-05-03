package uuidMdl

import (
	"github.com/gin-gonic/gin"
	"github.com/nu7hatch/gouuid"
)

func UUID() gin.HandlerFunc {
	return uuidMiddleware
}

func uuidMiddleware(c *gin.Context) {
	id, _ := uuid.NewV4()
	c.Set("uuid", id)
	c.Next()
}
