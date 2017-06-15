import {routerReducer as routing} from 'react-router-redux'
import {combineReducers} from 'redux'
import apiRequestReducers from './apiRequestReducers'


let injectedReducers = {};

export function injectReducers(r) {
    injectedReducers = Object.assign({}, r, injectedReducers);
}

export function rootReducer() {
    return combineReducers({
        api: apiRequestReducers,
        ...injectedReducers,
        routing
    });
}
