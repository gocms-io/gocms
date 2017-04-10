import {fork, takeEvery, call, put} from 'redux-saga/effects';
import * as actions from './actions/page';
import {Get} from '../services/api';
import { browserHistory } from 'react-router'


// import homeContainer from '../containers/home/home.sagas'


// fetch page content data based on uri from api
export function* fetchPageApi(uri) {
    let cleanUri = uri;
    if (uri == "/") {
        cleanUri = ""
    }
    let {res, err} = yield call(Get, `http://localhost:9090/themes/bslf/pages${cleanUri}/data.json`);
    if (res) {
        return res;
    }
    else {
        console.log("error getting page data.");
        browserHistory.push("/");
    }

}

// fetch page data based on uri
export function* fetchPageData(action) {
    const pageData = yield call(fetchPageApi, action.uri);
    yield put(actions.receivePage(action.uri, pageData));
}

// watch for page requests
export function* watchRequestPage() {
    yield takeEvery(actions.REQUEST_PAGE, fetchPageData);
}


/**
 * rootSaga
 */
export default function* rootSaga() {
    yield [
        fork(watchRequestPage),
    ];
    // yield fork(homeContainer);
}
