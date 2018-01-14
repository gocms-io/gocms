package sdk

import (
	"fmt"
	"github.com/gocms-io/gocms/context/consts"
	"github.com/gocms-io/gocms/utility/rest"
	"encoding/json"
	"github.com/gocms-io/gocms/utility/errors"
)

type Session interface {
	NewSdkErrorFromMessage(statusCode int, funcName string, body []byte) error
	NewSdkError(funcName string, message string) error
	Do(method rest.RequestMethod, endpoint string, body interface{}) (*rest.RestResponse, error)
}

type target struct {
	Url    string
	Secret string
}

func New(url string, secret string) Session {

	return &target{
		Url:    url,
		Secret: secret,
	}

}

func (s *target) getUrl(endpoint string) string {
	return fmt.Sprintf("%v%v", s.Url, endpoint)
}

func (s *target) getAuthHeader() map[string]string {
	headers := make(map[string]string)
	headers[consts.GOCMS_HEADER_MICROSERVICE_SECRET] = s.Secret
	return headers
}

func (s *target) Do(method rest.RequestMethod, endpoint string, body interface{}) (*rest.RestResponse, error) {
	bodyData, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	// create req
	req := rest.Request{
		Url:     s.getUrl(endpoint),
		Headers: s.getAuthHeader(),
		Body:    bodyData,
	}

	// do based on type
	var res *rest.RestResponse
	switch method {
	case rest.GET:
		res, err = req.Get()
	case rest.POST:
		res, err = req.Post()
	case rest.PUT:
		res, err = req.Put()
	case rest.DELETE:
		res, err = req.Delete()
	}

	if err != nil {
		return nil, err
	}

	return res, nil

}

func (s *target) NewSdkErrorFromMessage(statusCode int, funcName string, body []byte) error {

	var errorObj errors.ErrorResponse
	err := json.Unmarshal(body, errorObj)
	if err != nil {
		return errors.New(fmt.Sprintf("Gocms SDK Error [%v] - %v: %v", statusCode, funcName, string(body)))
	}

	return errors.New(fmt.Sprintf("Gocms SDK Error [%v] - %v: %v", statusCode, funcName, errorObj.Message))
}

func (s *target) NewSdkError(funcName string, message string) error {
	return errors.New(fmt.Sprintf("Gocms SDK Error - %v: %v", funcName, message))
}
