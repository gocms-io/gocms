package users

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/menklab/goCMS/services"
	"github.com/menklab/goCMS/routes"
	"github.com/menklab/goCMS/utility"
	"github.com/menklab/goCMS/models"
	"github.com/menklab/goCMS/utility/errors"
)

type UserController struct {
	routes *routes.ApiRoutes
	userService  services.IUserService
	authServices services.IAuthService
}

func Default(routes *routes.ApiRoutes, sg *services.ServicesGroup) *UserController{
	userController := &UserController{
		routes: routes,
		userService: sg.UserService,
		authServices: sg.AuthService,
	}
	return userController
}

func (uc *UserController) Use() {

	uc.routes.Auth.GET("/user", uc.get)
	uc.routes.Auth.PUT("/user", uc.update)

}

func (uc *UserController) get(c *gin.Context) {

	authUser, _ := utility.GetUserFromContext(c)

	c.JSON(http.StatusOK, authUser)
}

func (uc *UserController) update(c *gin.Context) {

	// get logged in user
	authUser, _ := utility.GetUserFromContext(c)

	// copy current user info into update user
	var userForUpdate models.User
	err := c.BindJSON(&userForUpdate) // update any changes from request
	if err != nil {
		errors.Response(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// verify password
	if ok := uc.authServices.VerifyPassword(authUser.Password, userForUpdate.ConfirmPassword); !ok {
		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
		return
	}

	// add acceptable fields to user for update
	authUser.Email = userForUpdate.Email
	authUser.FullName = userForUpdate.FullName
	authUser.NewPassword = userForUpdate.NewPassword

	// do update
	err = uc.userService.Update(authUser.Id, authUser)
	if err != nil {
		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
		return
	}

	//c.Status(http.StatusOK)
	c.Status(http.StatusOK)
}
