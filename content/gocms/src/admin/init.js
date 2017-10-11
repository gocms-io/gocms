import {injectSagas, rootSaga} from './config/sagas';
import {injectAuthedRoutes, registeredRoutes} from './config/router/routes';
import {injectReducers, registeredReducers} from './config/reducers/reducers';
import {injectLoginRoutes} from './containers/loginPage/loginPage.routes';

export function getModule() {
    return {
        name: "goCMS Admin",
        sagas: rootSaga,
        routes: registeredRoutes(),
        reducers: registeredReducers(),
    }
};


export function injectModule(a) {
    injectSagas(a.sagas);
    injectAuthedRoutes(a.routes);
    injectReducers(a.reducers);

    // if not null inject custom login route
    if (a.loginRoutes != "" && a.loginRoutes != null && a.loginRoutes != [] && a.loginRoutes != {}) {
        injectLoginRoutes(a.loginRoutes);
    }
}