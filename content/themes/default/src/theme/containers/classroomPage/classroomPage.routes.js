import React from 'react'
import {Route} from 'react-router'
import ClassroomPage from './classroomPage.container';

export default (
    <Route path='/classes'>
        <Route path=':room' component={ClassroomPage}/>
    </Route>
)