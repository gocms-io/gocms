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
                return res.json().then(
                    function (json) { // success

                        if (res.status == 200 || res.status == 204) {
                            // if we receive an auth token we should add this to the storage
                            if (res.headers.has(AUTH_TOKEN_HEADER)) {
                                sessionStorage.setItem(AUTH_TOKEN_HEADER, res.headers.get(AUTH_TOKEN_HEADER))
                            }
                            // if we receive a device token we should add this to the storage
                            if (res.headers.has(DEVICE_TOKEN_HEADER)) {
                                sessionStorage.setItem(DEVICE_TOKEN_HEADER, res.headers.get(DEVICE_TOKEN_HEADER))
                            }
                            return {status: res.status, json: json};
                        }
                        // if we have a authorization error we should delete the auth token

                        else {
                            switch (res.status) {
                                case 401:
                                case 403:
                                    sessionStorage.removeItem(AUTH_TOKEN_HEADER);
                                    return Promise.reject({status: res.status, json: json});
                                default:
                                    return Promise.reject({status: res.status, json: json});
                            }
                        }
                    })
            })
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