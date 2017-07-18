import React from 'react'
import {Route} from 'react-router'
import LoginRoutes from '../../containers/loginPage/loginPage.routes'
import {injectAdminRoutes, registeredAdminRoutes} from '../../containers/adminPages/adminPages.routes'


let routes =
    <Route>
        {registeredAdminRoutes()}
        {LoginRoutes}
    </Route>;


export function injectRoutes(r) {
    injectAdminRoutes(r);
}

export function registeredRoutes() {
    return routes;
}