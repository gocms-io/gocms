// import { take, put, call, fork, select, takeEvery, takeLatest } from 'redux-saga/effects'
// import * as actions from './home.actions'
// import { Get } from '../../utility/apiFetch'
// import { pageByUriSelector } from './home.reducers.selectors'
//
//
// export function fetchPageApi(uri) {
//     return new Get(`http://localhost:9090/content/${uri}`).callApi().then(
//         function(data) { // success
//             console.log("success: ", data)
//         },
//         function (err) { // fail
//             console.log("error with request: ", err)
//         }
//     );
// }
//
//
// export function* fetchPageData(uri) {
//     yield put(actions.requestPage(uri));
//     const pageData = yield call(fetchPageApi, uri);
//     yield put( actions.receivePage(uri, pageData) );
// }
//
// export function* watchRequestPage() {
//     yield takeLatest(actions.REQUEST_PAGE, fetchPageData);
// }
//
// export default function* root() {
//     yield fork(watchRequestPage)
// }