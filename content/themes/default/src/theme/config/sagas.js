import {fork, takeEvery, call, put} from 'redux-saga/effects';
// import * as actions from './actions/page';
// import {Get} from '../services/api';
import { browserHistory } from 'react-router'


// // fetch page content data based on uri from api
// function* fetchPageApi(uri) {
//     let cleanUri = uri;
//     if (uri == "/") {
//         cleanUri = ""
//     }
//     let {res, err} = yield call(Get, `${ASSET_BASE}/pages${cleanUri}/data.json`);
//     if (res) {
//         return res;
//     }
//     else {
//         console.log("error getting page data.");
//         browserHistory.push("/");
//     }
//
// }
//
// // fetch page data based on uri
// function* fetchPageData(action) {
//     const pageData = yield call(fetchPageApi, action.uri);
//     yield put(actions.receivePage(action.uri, pageData));
// }
//
// // watch for page requests
// export function* watchRequestPage() {
//     yield takeEvery(actions.REQUEST_PAGE, fetchPageData);
// }


/**
 * rootSaga
 */
export function rootSagas() {
    return function* () {
        yield [
            // fork(watchRequestPage),
        ]
    }
}
