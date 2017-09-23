package api_utility

import (
	"github.com/gin-gonic/gin"
	"github.com/gocms-io/gocms/models"
	"github.com/gocms-io/gocms/controllers/middleware/auth"
)

func GetUserFromContext(c *gin.Context) (*models.User, bool) {
	// get user from context
	if userContext, ok := c.Get(aclMdl.USER_CONTEXT_KEY); ok {
		if userDisplay, ok := userContext.(models.User); ok {
			return &userDisplay, true
		}
	}
	return nil, false
}
