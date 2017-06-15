export const REQUEST = 'API_REQUEST';
export const SUCCESS = 'API_SUCCESS';
export const FAILURE = 'API_FAIL';
export const PURGE = 'API_PURGE';

export function request(key, data) {
    return {
        type: REQUEST,
        key,
        data,
        requestedAt: Date.now()
    }
}

export function success(key, data) {
    return {
        type: SUCCESS,
        key,
        data,
        receivedAt: Date.now()
    }
}

export function failure(key, err) {
    return {
        type: FAILURE,
        key,
        err,
        receivedAt: Date.now()
    }
}

export function purge(key) {
    return {
        type: PURGE,
        key
    }
}