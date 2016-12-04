package services

import (
	"net/http"
	"bytes"
	"log"
	"io/ioutil"
	"github.com/menklab/goCMS/utility/errors"
)

var GET string = "GET"
var POST string = "POST"
var PUT string = "PUT"
var DELETE string = "DELETE"

type RestRequest struct {
	Url     string
	Headers map[string]string
	Body    []byte
	method  string
}

type RestResponse struct {
	StatusCode int
	Headers    map[string][]string
	Body       []byte
}

func (rr *RestRequest) Get() (*RestResponse, error) {
	rr.method = GET
	return rr.do()
}

func (rr *RestRequest) Post() (*RestResponse, error) {
	rr.method = POST
	return rr.do()
}

func (rr *RestRequest) do() (*RestResponse, error) {
	// create request
	req, err := http.NewRequest(rr.method, rr.Url, bytes.NewBuffer(rr.Body))
	if err != nil {
		log.Printf("Error creating new request: %s", err.Error())
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
		log.Printf("Error making request: %s", err.Error())
		return nil, err
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Printf("Error parsing request body: %s", err.Error())
		return nil, err
	}

	// check status code
	if res.StatusCode != 200 && res.StatusCode != 203 {
		log.Printf("Request was not ok: %s", body)
		return nil, errors.New(string(body))
	}

	restResponse := RestResponse{
		StatusCode: res.StatusCode,
		Headers: res.Header,
		Body: body,
	}

	return &restResponse, nil
}