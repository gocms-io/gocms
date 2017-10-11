import React from 'react'
import {Route} from 'react-router'
import LoginPage from './loginPage.container';

let injectedRoutes = [];

let routes =
    <Route>
        {injectedRoutes}
    </Route>;


export function registeredLoginRoutes() {
    if (injectedRoutes.length != 0) {
        return routes;
    }
    else {
        return <Route path="login" component={LoginPage}/>
    }
}

export function injectLoginRoutes(r) {
    injectedRoutes.push(r);
}