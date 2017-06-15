import React from 'react'
import {Route} from 'react-router'
import LoginRoutes from '../../containers/loginPage/loginPage.routes'
import AdminRoutes from '../../containers/adminPages/adminPages.routes'


export default (
    <Route>
        {AdminRoutes}
        {LoginRoutes}
    </Route>
)