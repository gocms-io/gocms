import {routerReducer as routing} from 'react-router-redux'
import authenticationReducers from './authenticationReducers'


let injectedReducers = {};

export function injectReducers(r) {
    injectedReducers = Object.assign({}, r, injectedReducers);
}

let rootReducers =
    {
    auth: authenticationReducers,
    ...injectedReducers,
    routing,
};

export function registeredReducers() {
    return rootReducers;
}