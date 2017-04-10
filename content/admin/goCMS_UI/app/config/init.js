'use strict';

import React from 'react';
import {render} from 'react-dom';
import routes from './router/routes'
import {Router} from 'react-router'
import {Provider} from 'react-redux'
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import configureStore from './store/configureStore'
import rootSaga from './sagas'

const store = configureStore(window.__INITIAL_STATE__);
store.runSaga(rootSaga, store.dispatch);

const history = syncHistoryWithStore(browserHistory, store);


// regular render
export function run() {
    render(
        <Provider store={store}>
            <Router history={history} routes={routes}/>
        </Provider>,
        document.getElementById('app')
    );
}
