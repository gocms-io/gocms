package routes

import "github.com/gin-gonic/gin"

const Internal = "Internal"

// Routes are the most basic organizational option available. They define urls as well as what level authentication is required.
type InternalRoutes struct {
	// Internal is the base route for internal microservice communication
	InternalRoot *gin.RouterGroup
}
