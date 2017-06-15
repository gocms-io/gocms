import { fork, takeEvery, put, call } from 'redux-saga/effects';
import loginPageSagas  from '../containers/loginPage/loginPage.sagas'


export default function* rootSaga() {
    yield [
        fork(loginPageSagas),
    ];
}