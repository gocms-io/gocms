import React from 'react'
import {Route} from 'react-router'
import DashboardPage from './dashboardPage.container';

export default (
    <Route>
        <Route path="dashboard" component={DashboardPage}/>
    </Route>
)