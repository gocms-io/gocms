import {requireAuthUser} from '../../services/authentication'
import React from 'react'
import DashboardRoutes from './dashboardPage/dashboardPage.routes';
import AdminTemplate from '../../templates/admin_tmpl'
import {Route, Redirect} from 'react-router'


let injectedRoutes = [];

let routes =
    <Route>
        <Route path="admin" component={AdminTemplate} onEnter={requireAuthUser}>
            {DashboardRoutes}
            {injectedRoutes}
        </Route>
        {/* redirect to default admin page will only be done after all other routes are check */}
        <Redirect from="*" to={GOCMS_LOGIN_SUCCESS_REDIRECT} />
    </Route>;


export function injectAdminRoutes(r) {
    injectedRoutes.push(r);
}

export function registeredAdminRoutes() {
    return routes;
}