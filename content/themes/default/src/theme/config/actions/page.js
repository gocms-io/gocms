export const REQUEST_PAGE = 'REQUEST_PAGE';
export const RECEIVE_PAGE = 'RECEIVE_PAGE';

export function requestPage(uri) {
    return {
        type: REQUEST_PAGE,
        uri,
    }
}

export function receivePage(uri, pageData) {
    return {
        type: RECEIVE_PAGE,
        uri,
        content: pageData,
        receivedAt: Date.now()
    }
}