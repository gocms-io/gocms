import {routerReducer as routing} from 'react-router-redux'
import authenticationReducers from './authenticationReducers'




const rootReducer = {
    auth: authenticationReducers,
    routing,
};

export default rootReducer