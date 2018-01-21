'use strict';

require("./styles/index.scss");

import {rootSagas} from './sagas';
import routes from './routes';
import reducers from './reducers'

export function init() {
    return {
        name: "bslf theme",
        sagas: rootSagas,
        routes: routes,
        reducers: reducers,
    }
}

window["theme"] = this;
// console.log("theme: ", window["theme"]);