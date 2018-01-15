package acl_sdk


import (
	"github.com/gocms-io/gocms/sdk"
	"strings"
	"strconv"
	"net/http"
	"github.com/gocms-io/gocms/utility/rest"
	"github.com/gocms-io/gocms/utility/log"
)


const ENDPOINT_IS_AUTHORIZED = "/internal/api/acl/isAuthorized/:userId/:permission"


type AclSDK struct{
	sdk.Session
}

func New(s sdk.Session) *AclSDK {
	return &AclSDK{s}
}


func (s *AclSDK) IsAuthorized(userId int64, permission string) (bool, error) {

	endpointWithData := strings.Replace(ENDPOINT_IS_AUTHORIZED, ":userId",  strconv.FormatInt(userId, 10), -1)
	endpointWithData = strings.Replace(endpointWithData, ":permission", permission, -1)


	res, err := s.SkipHttpStatusError().Do(rest.GET, endpointWithData, nil)
	if err != nil && res.StatusCode != http.StatusUnauthorized{
		return false, s.NewSdkError( "IsAuthorized", err.Error())
	}

	if res.StatusCode != http.StatusOK {
		if res.StatusCode == http.StatusUnauthorized {
			return false, nil
		}
		return false, s.NewSdkErrorFromMessage(res.StatusCode, "IsAuthorized", res.Body)
	}

	return  true, nil
}


