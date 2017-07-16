import {fork} from 'redux-saga/effects';

let injectedSagas = [];
let sagas = [];


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