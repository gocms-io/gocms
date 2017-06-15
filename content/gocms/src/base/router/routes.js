import React from 'react'
import {Route} from 'react-router'
import BaseTemplate from '../base_tmpl'

let injectedRoutes = [];
let routes =
    <Route component={BaseTemplate}>
            {injectedRoutes}
    </Route>;



export function injectRoutes(r) {
    injectedRoutes.push(r);
}

export function registeredRoutes() {
    return routes;
}