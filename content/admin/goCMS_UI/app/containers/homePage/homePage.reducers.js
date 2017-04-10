// import {combineReducers} from 'redux'
// import {REQUEST_PAGE, RECEIVE_PAGE} from './home.actions';
//
//
// const initialState = {};
//
// function page(state = {
//     isFetching: false,
//     items: []
// }, action) {
//     switch (action.type) {
//         case REQUEST_PAGE:
//             return {...state, isFetching: true};
//
//         case RECEIVE_PAGE:
//             return {
//                 ...state,
//                 isFetching: false,
//                 content: action.content,
//                 lastUpdated: action.receivedAt
//             };
//         default:
//             return state
//     }
// }
//
// function pageByUri(state = initialState, action) {
//     switch (action.type) {
//         case REQUEST_PAGE:
//         case RECEIVE_PAGE:
//             return {
//                 ...state,
//                 [action.uri]: page(state[action.uri], action)
//             };
//         default:
//             return state
//     }
// }
//
// const rootReducer = combineReducers({
//     pageByUri,
// });
//
// export default rootReducer