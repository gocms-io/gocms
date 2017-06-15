// export const REQUEST = 'REQUEST';
// export const SUCCESS = 'FORM_SUCCESS';
// export const FAILURE = 'FORM_FAIL';
//
// export function request(key, uri, data) {
//     return {
//         type: REQUEST,
//         uri,
//         key,
//         data,
//         pending: true,
//         requestedAt: Date.now()
//     }
// }
//
// export function success(key, data) {
//     return {
//         type: SUCCESS,
//         key,
//         data,
//         pending: false,
//         receivedAt: Date.now()
//     }
// }
//
// export function failure(key, err) {
//     return {
//         type: FAILURE,
//         key,
//         err,
//         pending: false,
//         receivedAt: Date.now()
//     }
// }