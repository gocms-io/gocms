package rest

import (
	"bytes"
	"github.com/gocms-io/gocms/utility/errors"
	"io/ioutil"
	"net/http"
	"github.com/gocms-io/gocms/utility/log"
)

type RequestMethod string


const GET RequestMethod = "GET"
const POST RequestMethod = "POST"
const PUT RequestMethod = "PUT"
const DELETE RequestMethod = "DELETE"

type Request struct {
	Url     string
	Headers map[string]string
	Body    []byte
	method  RequestMethod
}

type RestResponse struct {
	StatusCode int
	Headers    map[string][]string
	Body       []byte
}

func (rr *Request) Get() (*RestResponse, error) {
	rr.method = GET
	return rr.do()
}

func (rr *Request) Post() (*RestResponse, error) {
	rr.method = POST
	return rr.do()
}

func (rr *Request) Put() (*RestResponse, error) {
	rr.method = PUT
	return rr.do()
}

func (rr *Request) Delete() (*RestResponse, error) {
	rr.method = DELETE
	return rr.do()
}

func (rr *Request) do() (*RestResponse, error) {
	// create request
	req, err := http.NewRequest(string(rr.method), rr.Url, bytes.NewBuffer(rr.Body))
	if err != nil {
		log.Errorf("Error creating new request: %s", err.Error())
		return nil, err
	}

	// add headers
	req.Header.Set("Content-Type", "application/json")
	if rr.Headers != nil {
		for key, value := range rr.Headers {
			req.Header.Set(key, value)
		}
	}

	client := http.DefaultClient
	res, err := client.Do(req)
	if err != nil {
		log.Errorf("Error making request: %s", err.Error())
		return nil, err
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Errorf("Error parsing request body: %s", err.Error())
		return nil, err
	}

	// check status code
	if res.StatusCode != 200 && res.StatusCode != 203 {
		log.Errorf("Request was not ok: %s", body)
		return nil, errors.New(string(body))
	}

	restResponse := RestResponse{
		StatusCode: res.StatusCode,
		Headers:    res.Header,
		Body:       body,
	}

	return &restResponse, nil
}
