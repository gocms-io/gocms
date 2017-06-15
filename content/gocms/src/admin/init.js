import sagas from './config/sagas';
import routes from './config/router/routes';
import reducers from './config/reducers/reducers'

export default {
    name: "goCMS Admin",
    sagas: sagas,
    routes: routes,
    reducers: reducers,
};


