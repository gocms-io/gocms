import {createStore, applyMiddleware, compose} from 'redux'
import {createLogger} from 'redux-logger'
import createSagaMiddleware, {END} from 'redux-saga'

export default function configureStore(initialState, rootReducer) {


    const sagaMiddleware = createSagaMiddleware();
    const logger = createLogger({
        collapsed: true
    });

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    let store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(
            applyMiddleware(
                sagaMiddleware,
                logger
            )),
    );

    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);

    return store;
}