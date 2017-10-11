import React from 'react'
import {Route} from 'react-router'
import {registeredLoginRoutes} from '../../containers/loginPage/loginPage.routes'
import {injectAdminRoutes, registeredAdminRoutes} from '../../containers/adminPages/adminPages.routes'


export function injectAuthedRoutes(r) {
    injectAdminRoutes(r);
}



export function registeredRoutes() {
    return <Route>
        {registeredLoginRoutes()}
        {registeredAdminRoutes()}
    </Route>;
}