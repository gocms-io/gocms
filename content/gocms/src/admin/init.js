import sagas, {injectSagas,} from './config/sagas';
import {injectRoutes, registeredRoutes} from './config/router/routes';
import {injectReducers, registeredReducers} from './config/reducers/reducers'

export function getModule() {
    return {
        name: "goCMS Admin",
        sagas: sagas,
        routes: registeredRoutes(),
        reducers: registeredReducers(),
    }
};


export function injectModule(a) {
    injectSagas(a.sagas);
    injectRoutes(a.routes);
    injectReducers(a.reducers);
}