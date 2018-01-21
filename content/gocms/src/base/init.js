'use strict';
require("./styles/index.scss");
import React from 'react';
import {render} from 'react-dom';
import {rootSaga, injectSagas} from './sagas/sagas'
import {registeredRoutes, injectRoutes} from './router/routes'
import {injectReducers, rootReducer} from './reducers/reducers'
import {Router} from 'react-router'
import {Provider} from 'react-redux'
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import configureStore from './store/configureStore'

// init store, sagas, history, and routes
let store = configureStore(window.__INITIAL_STATE__, rootReducer());
store.runSaga(rootSaga(), store.dispatch);
let history = syncHistoryWithStore(browserHistory, store);
let routes = registeredRoutes();

export function init() {
    console.log("init");
    // render out doc
    render(
        <Provider store={store}>
            <Router onUpdate={() => window.scrollTo(0, 0)} history={history} routes={routes}/>
        </Provider>,
        document.getElementById('app')
    );
}

export function getReact() {
    return React
}

export function getStore() {
    return store;
}

export function injectModule(a) {
    console.log("injectModule");
    injectSagas(a.sagas);
    injectRoutes(a.routes);
    injectReducers(a.reducers);
}
