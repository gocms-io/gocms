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


export function exportDeps() {
    // window['react-router'] = require('react-router');
    // window["babel-polyfill"] = require("babel-polyfill");
    // window["es6-promise"] = require("es6-promise");
    // window["formsy-react"] = require("formsy-react");
    // window["isomorphic-fetch"] = require("isomorphic-fetch");
    // window["jwt-decode"] = require("jwt-decode");
    // window["react"] = require("react");
    // window["react-addons-css-transition-group"] = require("react-addons-css-transition-group");
    // window["react-dom"] = require("react-dom");
    // window["react-form"] = require("react-form");
    // window["react-redux"] = require("react-redux");
    // window["react-router"] = require("react-router");
    // window["react-router-redux"] = require("react-router-redux");
    // window["react-transition-group"] = require("react-transition-group");
    // window["redux"] = require("redux");
    // window["redux-form"] = require("redux-form");
    // window["redux-logger"] = require("redux-logger");
    // window["redux-saga"] = require("redux-saga");
}

export function init() {
    // render out doc
    render(
        <Provider store={store}>
            <Router onUpdate={() => window.scrollTo(0, 0)} history={history} routes={routes}/>
        </Provider>,
        document.getElementById('app')
    );
}

window["gocms"] = this;
console.log("gocms")

export function getStore() {
    return store;
}

export function injectModule(a) {
    console.log("injectModule");
    injectSagas(a.sagas);
    injectRoutes(a.routes);
    injectReducers(a.reducers);
}
