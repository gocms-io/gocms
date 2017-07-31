import {routerReducer as routing} from 'react-router-redux'
import authenticationReducers from './authenticationReducers'


let injectedReducers = {};

export function injectReducers(r) {
    injectedReducers = Object.assign({}, r, injectedReducers);
}

export function registeredReducers() {
    return  {
        auth: authenticationReducers,
        ...injectedReducers,
        routing,
    };
}