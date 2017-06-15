// import {combineReducers} from 'redux'
// import * as actions from '../../config/actions/form';
//
// function _formRequestReducer(state = {}, action) {
//     let key = action.key;
//     switch (action.type) {
//         case actions.REQUEST:
//             return {
//                 ...state,
//                 [key]: {
//                     ...state[key],
//                     key: action.key,
//                     isFetching: true,
//                     requestedAt: action.requestedAt
//                 }
//             };
//         case actions.SUCCESS:
//             return {
//                 ...state,
//                 [key]: {
//                     ...state[key],
//                     key: action.key,
//                     isFetching: false,
//                     receivedAt: action.receivedAt,
//                     data: action.data
//                 }
//             };
//         case actions.FAILURE:
//             return {
//                 ...state,
//                 [key]: {
//                     ...state[key],
//                     key: action.key,
//                     isFetching: false,
//                     receivedAt: action.receivedAt,
//                     err: action.err
//                 }
//             };
//         default:
//             return state
//     }
// }
//
//
// const formRequestReducer = combineReducers({
//     _formRequestReducer,
// });
//
// export default formRequestReducer