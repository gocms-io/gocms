import { fork, takeEvery, put, call } from 'redux-saga/effects';
import loginPageSagas  from '../containers/loginPage/loginPage.sagas'

let injectedSagas = [];

export default function* rootSaga() {
    yield [
        fork(loginPageSagas),
        ...injectedSagas
    ];
}

export function injectSagas(s) {
    injectedSagas.push(fork(s));
}