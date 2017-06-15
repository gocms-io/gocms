import {requireAuthUser} from '../../services/authentication'
import React from 'react'
import DashboardRoutes from './dashboardPage/dashboardPage.routes';
import AdminTemplate from '../../templates/admin_tmpl'
import {Route, Redirect} from 'react-router'


export default (
    <Route>
        <Redirect from="admin" to="admin/dashboard"/>
        <Route path="admin" component={AdminTemplate} onEnter={requireAuthUser}>
            {DashboardRoutes}
        </Route>
    </Route>
)