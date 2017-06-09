import React from 'react'
import {Route, Redirect} from 'react-router'
import DefaultTemplate from '../templates/default_tmpl'
import HomePageRouter from '../containers/homePage/homePage.routes'

export default (
    <Route component={DefaultTemplate}>

        <Route path="/">
            {HomePageRouter} /* default route */
        </Route>
        {/*{AboutPageRouter}*/}
        /* and other routers */
    </Route>
)
