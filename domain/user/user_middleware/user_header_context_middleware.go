package user_middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/myanrichal/gocms/context/consts"
	"github.com/myanrichal/gocms/domain/user/user_model"
)

// example of how to grab user header context for use in plugins.
// copy paste this code.
func getUserFromContext(c *gin.Context) (*user_model.UserContextHeader, bool) {
	// get user from context
	if userContext, ok := c.Get(consts.USER_KEY_FOR_GIN_CONTEXT); ok {
		if userHeaderContext, ok := userContext.(user_model.UserContextHeader); ok {
			return &userHeaderContext, true
		}
	}
	return nil, false
}
