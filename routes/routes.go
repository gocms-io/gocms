package routes

import "github.com/gin-gonic/gin"

// Routes are the most basic organizational option available. They define urls as well as what level authentication is required.
type Routes struct {
	// Root provides access to / and allows for just about anything. No authentication is applied.
	Root *gin.RouterGroup
	// Public provides access to the /api route. No authentication is applied.
	Public *gin.RouterGroup
	// PreTwoFactor provides access to the /api route. It requires user authenticate through stage 1 (ie. Username/Password), but doesn't require stage 2 authentication. (TwoFactor Must Be Active)
	PreTwofactor *gin.RouterGroup
	// Auth requires that the user is fully authenticated. This could be just stage 1 or both stage 1 and 2 depending on if two factor is disabled or enabled respectively.
	Auth *gin.RouterGroup
	// NoRoute is not currently available to plugins.
	NoRoute func(...gin.HandlerFunc)
}
