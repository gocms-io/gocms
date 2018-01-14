package user_sdk

import (
	"github.com/gocms-io/gocms/domain/user/user_model"
	"github.com/gocms-io/gocms/utility/rest"
	"encoding/json"
	"net/http"
	"github.com/gocms-io/gocms/sdk"
)

const ENDPOINT_ADD_USER = "/internal/api/user"


type UserSDK struct{
	sdk.Session
}

func New(s sdk.Session) *UserSDK {
	return &UserSDK{s}
}


func (s *UserSDK) Add(uai *user_model.UserAdminInput) (*user_model.User, error) {

	res, err := s.Do(rest.POST, ENDPOINT_ADD_USER, uai)
	if err != nil {
		return nil, s.NewSdkError( "AddUser", err.Error())
	}

	if res.StatusCode != http.StatusOK {
		return nil,  s.NewSdkErrorFromMessage(res.StatusCode, "AddUser", res.Body)
	}

	// marshal body into user
	var user user_model.User
	err = json.Unmarshal(res.Body, &user)

	// return user and if error then the error
	return &user, err
}

