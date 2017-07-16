import fetch from 'isomorphic-fetch';

export const AUTH_TOKEN_HEADER = 'X-Auth-Token';
export const DEVICE_TOKEN_HEADER = 'X-Device-Token';
export const USER_DATA_STORAGE_KEY = 'USER_DATA_STORAGE_KEY';
export const ENDPOINTS = {
    login: "/api/login"
};


let defaultOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default',
    method: 'GET',
    body: null
};

export default class Api {
    constructor(url, options = {}) {
        this.url = url;
        this.options = Object.assign(defaultOptions, options);

        // add auth headers if they are present
        if (!!sessionStorage.getItem(AUTH_TOKEN_HEADER)) {
            this.options.headers[AUTH_TOKEN_HEADER] = sessionStorage.getItem(AUTH_TOKEN_HEADER);
        }
        if (!!sessionStorage.getItem(DEVICE_TOKEN_HEADER)) {
            this.options.headers[DEVICE_TOKEN_HEADER] = sessionStorage.getItem(DEVICE_TOKEN_HEADER);
        }

        this.fetch = fetch;
    }

    callApi() {
        return this.fetch(this.url, this.options)
            .then(function (res) {
                if (res.status >= 200 && res.status < 300) {
                    // if we receive an auth token we should add this to the storage
                    if (res.headers.has(AUTH_TOKEN_HEADER)) {
                        sessionStorage.setItem(AUTH_TOKEN_HEADER, res.headers.get(AUTH_TOKEN_HEADER))
                    }
                    // if we receive a device token we should add this to the storage
                    if (res.headers.has(DEVICE_TOKEN_HEADER)) {
                        sessionStorage.setItem(DEVICE_TOKEN_HEADER, res.headers.get(DEVICE_TOKEN_HEADER))
                    }

                    return res.json()
                        .then(
                            function (json) {
                                return {status: res.status, json: json}
                            })
                        .catch(function (e) {
                            return {status: res.status}; // not really an error. If request wasn't a json request then skip
                        });
                }
                else {
                    // try to get error message from json
                    return res.json()
                        .then(
                            function (json) {
                                return Promise.reject({status: res.status, json: json})
                            })
                        .catch(function (e) {
                            switch (e.status) {
                                case 401:
                                case 403:
                                    sessionStorage.removeItem(AUTH_TOKEN_HEADER);
                                    return Promise.reject(e);
                                default:
                                    return Promise.reject(e);
                            }
                        });

                }
            })
            //         // todo then we need to add a success handler to the contact form so that people only submit once
            //         // todo then we need to update the forms to allow for subit and error as apposed to just a disabled btn
            .then(
                function (res) { // success
                    return {res};
                },
                function (err) { //fail
                    return {err}
                });
    }
}


export function Get(url, options = {}) {
    options.method = "GET";
    return new Api(url, options).callApi();
}

export function Post(url, body, options = {}) {
    options.method = "POST";

    // stringify body if needed
    if (!!body) {
        options.body = JSON.stringify(body);
    }
    return new Api(url, options).callApi();
}

export function Put(url, body, options = {}) {
    options.method = "PUT";

    // stringify body if needed
    if (!!body) {
        options.body = JSON.stringify(body);
    }
    return new Api(url, options).callApi();
}

export function Delete(url, options = {}) {
    options.method = "Delete";
    return new Api(url, options).callApi();
}