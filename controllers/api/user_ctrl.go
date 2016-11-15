package api

//import (
//	"github.com/gin-gonic/gin"
//	"net/http"
//	"bitbucket.org/menklab/grnow-services/services"
//	"bitbucket.org/menklab/grnow-services/utility/errors"
//)
//
//type UserController struct {
//	userService  services.IUserService
//	authServices services.IAuthService
//}
//
//func (self *UserController) Init(routes *config.Routes) {
//	self.userService = services.GetUserService()
//	self.authServices = services.GetAuthService()
//
//	routes.Auth.GET("/user", self.get)
//	routes.Auth.PUT("/user", self.update)
//
//}
//
//func (self *UserController) get(c *gin.Context) {
//
//	authUser, _ := utility.GetUserFromContext(c)
//
//	c.JSON(http.StatusOK, authUser)
//}
//
//func (self *UserController) update(c *gin.Context) {
//
//	// get logged in user
//	authUser, _ := utility.GetUserFromContext(c)
//
//	// copy current user info into update user
//	var userForUpdate models.User
//	err := c.BindJSON(&userForUpdate) // update any changes from request
//	if err != nil {
//		errors.Response(c, http.StatusBadRequest, err.Error(), err)
//		return
//	}
//
//	// verify password
//	if ok := self.authServices.VerifyPassword(authUser.Password, userForUpdate.ConfirmPassword); !ok {
//		errors.Response(c, http.StatusUnauthorized, "Bad Password.", err)
//		return
//	}
//
//	// add acceptable fields to user for update
//	authUser.Email = userForUpdate.Email
//	authUser.FullName = userForUpdate.FullName
//	authUser.NewPassword = userForUpdate.NewPassword
//
//	// do update
//	err = self.userService.Update(authUser.Id, authUser)
//	if err != nil {
//		errors.Response(c, http.StatusInternalServerError, "Couldn't update user.", err)
//		return
//	}
//
//	//c.Status(http.StatusOK)
//	c.Status(http.StatusOK)
//}
