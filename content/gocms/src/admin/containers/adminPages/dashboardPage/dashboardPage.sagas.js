// import {fork, takeEvery, put, call} from 'redux-saga/effects';
// import * as apiActions from '../../../base/actions/apiRequestActions'; // importing our action
// import {login} from '../../config/actions/authenticationActions'
// import {Post, ENDPOINTS} from '../../../base/services/api';
// import { browserHistory } from 'react-router'
//
//
// // watch for login requests
// function* watchLoginSaga() {
//     yield takeEvery(apiActions.REQUEST, handleLoginSaga); // see details what is REQUEST param below
// }
//
// function* handleLoginSaga(action) {
//     let {res, err} = yield call(Post, ENDPOINTS.login, action.data); // calling our api method
//     if (res) {
//         // push user info to store
//         yield put(login(res.json));
//         yield put(apiActions.purge(action.key));
//         browserHistory.push(GOCMS_LOGIN_SUCCESS_REDIRECT);
//     }
//     else if (err) {
//         // fetch page data based on uri
//         yield put(apiActions.failure(action.key, err));
//     }
// }
//
// export default function* loginPageSagas() {
//     yield [
//         fork(watchLoginSaga),
//     ];
// }