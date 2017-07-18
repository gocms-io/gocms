package api_utility

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/models"
)

func GetUserFromContext(c *gin.Context) (*models.User, bool) {
	// get user from context
	if userContext, ok := c.Get("user"); ok {
		if userDisplay, ok := userContext.(models.User); ok {
			return &userDisplay, true
		}
	}
	return nil, false
}
