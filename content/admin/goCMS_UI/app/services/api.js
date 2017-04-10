import fetch from 'isomorphic-fetch';

let defaultOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default'
};

export default class Api {
    constructor(url, options) {
        this.url = url;
        this.options = Object.assign(defaultOptions, options);
        this.fetch = fetch;
    }

    callApi() {
        return this.fetch(this.url, this.options)
            .then(function (res) {
                    if (res.status == 200 || res.status == 204) {
                        return res.json()
                    }
                    else {
                        switch (res.status) {
                            default:
                                return Promise.reject(res);
                        }
                    }
                }
            )
            .then(
                function (res) { // success
                    return ({res});
                },
                function (err) { // fail
                    return ({err});
                })
    }
}


export class Post extends Api {
    constructor(url, options) {
        options = Object.assign({method: 'POST'}, options);
        super(url, options);
    }
}

export function Get(uri) {
    let options = {
        method: 'GET'
    };
    return new Api(uri, options).callApi();
}