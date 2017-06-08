'use strict';

import sagas from './sagas';
import routes from './routes';
import reducers from './reducers'

const app = {
    name: "default theme",
    sagas: sagas,
    routes: routes,
    reducers: reducers,
};

export default app;