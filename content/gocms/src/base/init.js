'use strict';

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

let store = null;
let history = null;
let routes = null;

// regular render
export function run() {
    // init store, sagas, history, and routes
    store = configureStore(window.__INITIAL_STATE__, rootReducer());
    store.runSaga(rootSaga(), store.dispatch);
    history = syncHistoryWithStore(browserHistory, store);
    routes = registeredRoutes();

    // render out doc
    render(
        <Provider store={store}>
            <Router onUpdate={() => window.scrollTo(0, 0)} history={history} routes={routes} />
        </Provider>,
        document.getElementById('app')
    );
}

export function getStore() {
    return store;
}

export function injectApp(a) {
    injectSagas(a.sagas);
    injectRoutes(a.routes);
    injectReducers(a.reducers);
}

