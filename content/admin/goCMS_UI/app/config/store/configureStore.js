import {createStore, applyMiddleware, compose} from 'redux'
import rootReducer from '../reducers'
import {createLogger} from 'redux-logger'
import createSagaMiddleware, {END} from 'redux-saga'

export default function configureStore(initialState) {

    const sagaMiddleware = createSagaMiddleware();
    const logger = createLogger({
        collapsed: true
    });

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(
            applyMiddleware(
                sagaMiddleware,
                logger
            ))
    );

    // detect if we're loading for the first time or reloading
    if (module.hot) {
        module.hot.accept('./reducers', (d) => {
            store.replaceReducer(require('../reducers').default);
        });
    }


    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);

    return store;
}