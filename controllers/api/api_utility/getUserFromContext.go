package api_utility

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/models"
	"github.com/gocms-io/gocms/context/consts"
)

func GetUserFromContext(c *gin.Context) (*models.User, bool) {
	// get user from context
	if userContext, ok := c.Get(consts.USER_KEY_FOR_GIN_CONTEXT); ok {
		if userDisplay, ok := userContext.(models.User); ok {
			return &userDisplay, true
		}
	}
	return nil, false
}
