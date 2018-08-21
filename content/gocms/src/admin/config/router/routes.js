import React from 'react'
import {Route} from 'react-router'
import {registeredLoginRoutes} from '../../containers/loginPage/loginPage.routes'
import {injectAdminRoutes, registeredAdminRoutes} from '../../containers/adminPages/adminPages.routes'


export function injectAuthedRoutes(r) {
    injectAdminRoutes(r);
}

export function registeredRoutes() {
    console.log("routes.js");
    return ( 
    <Switch>
        {registeredLoginRoutes()}
        {registeredAdminRoutes()}
        <Route path="will-match" component={WillMatch} />
        {/* <Redirect from="*" to="/"/> */}
        <Route path="*" component={NoMatch} status={404}/>
    </Switch>
    );
}

//our these routes stemming out from /api/  ?


const WillMatch = () => (
    <div>
        <h3>
            This is going to match yes yes yes
        </h3>
    </div>
);

const NoMatch = ({ location }) => (
    <div>
        <h3>
            No match for <code>{location.pathname}</code>
        </h3>
    </div>
);