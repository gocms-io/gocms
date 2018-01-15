package group_sdk


import (
"github.com/gocms-io/gocms/utility/rest"
"net/http"
"github.com/gocms-io/gocms/sdk"
	"strings"
	"strconv"
)

const ENDPOINT_ADD_USER_TO_GROUP_BY_NAME = "/internal/api/acl/addUser/:userId/toGroupByName/:groupName"
const ENDPOINT_DELETE_USER_FROM_GROUP_BY_NAME = "internal/api/acl/removeUser/:userId/fromGroupByName/:groupName"


type GroupSDK struct{
	sdk.Session
}

func New(s sdk.Session) *GroupSDK {
	return &GroupSDK{s}
}


func (s *GroupSDK) AddUserToGroupByName(userId int64, groupName string) error {

	endpointWithData := strings.Replace(ENDPOINT_ADD_USER_TO_GROUP_BY_NAME, ":userId", strconv.FormatInt(userId, 10), -1)
	endpointWithData = strings.Replace(endpointWithData, ":groupName", groupName, -1)

	res, err := s.Do(rest.POST, endpointWithData, nil)
	if err != nil {
		return s.NewSdkError( "AddUserToGroupByName", err.Error())
	}

	if res.StatusCode != http.StatusOK {
		return s.NewSdkErrorFromMessage(res.StatusCode, "AddUserToGroupByName", res.Body)
	}

	return  err
}

func (s *GroupSDK) DeleteUserFromGroupByName(userId int64, groupName string) error {

	endpointWithData := strings.Replace(ENDPOINT_DELETE_USER_FROM_GROUP_BY_NAME, ":userId",  strconv.FormatInt(userId, 10), 0)
	endpointWithData = strings.Replace(endpointWithData, ":groupName", groupName, 0)


	res, err := s.Do(rest.POST, endpointWithData, nil)
	if err != nil {
		return s.NewSdkError( "DeleteUserFromGroupByName", err.Error())
	}

	if res.StatusCode != http.StatusOK {
		return s.NewSdkErrorFromMessage(res.StatusCode, "DeleteUserFromGroupByName", res.Body)
	}

	return  err
}

