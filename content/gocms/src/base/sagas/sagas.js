import {fork} from 'redux-saga/effects';

let injectedSagas = [];


export function rootSaga() {
    return function* () {
        yield [
            ...injectedSagas
        ]
    }
}

export function injectSagas(s) {
    injectedSagas.push(fork(s));
}