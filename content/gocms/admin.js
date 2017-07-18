(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("gocms/admin/components/basicComponent/BasicComponent.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicComponent = function (_React$Component) {
    (0, _inherits3.default)(BasicComponent, _React$Component);

    function BasicComponent(props) {
        (0, _classCallCheck3.default)(this, BasicComponent);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BasicComponent.__proto__ || (0, _getPrototypeOf2.default)(BasicComponent)).call(this, props));

        _this.state = {};
        return _this;
    }

    (0, _createClass3.default)(BasicComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'p',
                { className: 'basic-component' },
                'Basic Component'
            );
        }
    }]);
    return BasicComponent;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(BasicComponent);

});

require.register("gocms/admin/config/actions/authenticationActions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.saveUserToState = saveUserToState;
exports.removeUserFromState = removeUserFromState;
var SAVE_USER_TO_STATE = exports.SAVE_USER_TO_STATE = 'SAVE_USER_TO_STATE';
var REMOVE_USER_FROM_STATE = exports.REMOVE_USER_FROM_STATE = 'REMOVE_USER_FROM_STATE';

function saveUserToState(user) {
    return {
        type: SAVE_USER_TO_STATE,
        user: user,
        loggedInAt: Date.now()
    };
}

function removeUserFromState() {
    return {
        type: REMOVE_USER_FROM_STATE
    };
}

});

;require.register("gocms/admin/config/reducers/authenticationReducers.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _redux = require('redux');

var _authenticationActions = require('../actions/authenticationActions');

var actions = _interopRequireWildcard(_authenticationActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function authenticationReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    switch (action.type) {
        case actions.SAVE_USER_TO_STATE:
            return (0, _extends3.default)({}, state, action.user, {
                loggedInAt: action.loggedInAt
            });
        case actions.REMOVE_USER_FROM_STATE:
            var s = (0, _extends3.default)({}, state);
            delete s['user'];
            return s;
        default:
            return state;
    }
}

var authenticationReducers = (0, _redux.combineReducers)({
    user: authenticationReducer
});

exports.default = authenticationReducers;

});

require.register("gocms/admin/config/reducers/reducers.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.injectReducers = injectReducers;
exports.registeredReducers = registeredReducers;

var _reactRouterRedux = require('react-router-redux');

var _authenticationReducers = require('./authenticationReducers');

var _authenticationReducers2 = _interopRequireDefault(_authenticationReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedReducers = {};

function injectReducers(r) {
    injectedReducers = (0, _assign2.default)({}, r, injectedReducers);
}

var rootReducers = (0, _extends3.default)({
    auth: _authenticationReducers2.default
}, injectedReducers, {
    routing: _reactRouterRedux.routerReducer
});

function registeredReducers() {
    return rootReducers;
}

});

;require.register("gocms/admin/config/router/routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectRoutes = injectRoutes;
exports.registeredRoutes = registeredRoutes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _loginPage = require('../../containers/loginPage/loginPage.routes');

var _loginPage2 = _interopRequireDefault(_loginPage);

var _adminPages = require('../../containers/adminPages/adminPages.routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = _react2.default.createElement(
    _reactRouter.Route,
    null,
    (0, _adminPages.registeredAdminRoutes)(),
    _loginPage2.default
);

function injectRoutes(r) {
    (0, _adminPages.injectAdminRoutes)(r);
}

function registeredRoutes() {
    return routes;
}

});

;require.register("gocms/admin/config/sagas.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = rootSaga;
exports.injectSagas = injectSagas;

var _effects = require('redux-saga/effects');

var _loginPage = require('../containers/loginPage/loginPage.sagas');

var _loginPage2 = _interopRequireDefault(_loginPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [rootSaga].map(_regenerator2.default.mark);

var injectedSagas = [];

function rootSaga() {
    return _regenerator2.default.wrap(function rootSaga$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return [(0, _effects.fork)(_loginPage2.default)].concat(injectedSagas);

                case 2:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

function injectSagas(s) {
    injectedSagas.push((0, _effects.fork)(s));
}

});

;require.register("gocms/admin/containers/adminPages/adminPages.routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectAdminRoutes = injectAdminRoutes;
exports.registeredAdminRoutes = registeredAdminRoutes;

var _authentication = require('../../services/authentication');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dashboardPage = require('./dashboardPage/dashboardPage.routes');

var _dashboardPage2 = _interopRequireDefault(_dashboardPage);

var _admin_tmpl = require('../../templates/admin_tmpl');

var _admin_tmpl2 = _interopRequireDefault(_admin_tmpl);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedRoutes = [];

var routes = _react2.default.createElement(
    _reactRouter.Route,
    null,
    _react2.default.createElement(_reactRouter.Redirect, { from: 'admin', to: 'admin/dashboard' }),
    _react2.default.createElement(
        _reactRouter.Route,
        { path: 'admin', component: _admin_tmpl2.default, onEnter: _authentication.requireAuthUser },
        _dashboardPage2.default,
        injectedRoutes
    )
);

function injectAdminRoutes(r) {
    injectedRoutes.push(r);
}

function registeredAdminRoutes() {
    return routes;
}

});

;require.register("gocms/admin/containers/adminPages/components/mainMenu/MainMenu.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _authentication = require('../../../../services/authentication');

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicComponent = function (_React$Component) {
    (0, _inherits3.default)(BasicComponent, _React$Component);

    function BasicComponent(props) {
        (0, _classCallCheck3.default)(this, BasicComponent);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BasicComponent.__proto__ || (0, _getPrototypeOf2.default)(BasicComponent)).call(this, props));

        _this.handleMenuOpenCloseClick = _this.handleMenuOpenCloseClick.bind(_this);
        _this.handleSignOut = _this.handleSignOut.bind(_this);

        _this.state = {
            menuIsOpen: true
        };
        return _this;
    }

    (0, _createClass3.default)(BasicComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'handleSignOut',
        value: function handleSignOut(e) {
            e.preventDefault();
            (0, _authentication.logout)();
            _reactRouter.browserHistory.push("/login");
        }
    }, {
        key: 'handleMenuOpenCloseClick',
        value: function handleMenuOpenCloseClick(e) {
            this.setState({ menuIsOpen: !this.state.menuIsOpen });
        }
    }, {
        key: 'render',
        value: function render() {
            // console.log("user: ", this.state.user);
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    {
                        className: "g-container g-a-main-menu-container" + (this.state.menuIsOpen ? " g-a-main-menu-container-open" : " g-a-main-menu-container-close") },
                    _react2.default.createElement(
                        'div',
                        {
                            className: "g-container g-a-main-menu-title-container" + (this.state.menuIsOpen ? " g-a-main-menu-title-container-open" : " g-a-main-menu-title-container-close") },
                        _react2.default.createElement(
                            'div',
                            { className: 'g-a-main-menu-profile-img-container' },
                            _react2.default.createElement(
                                'a',
                                { href: '', className: 'g-a-main-menu-profile-img' },
                                _react2.default.createElement('i', { className: 'gocms-icon-user' })
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'g-container-col' },
                            _react2.default.createElement(
                                'h1',
                                { className: 'g-a-main-menu-title' },
                                'GoCMS'
                            ),
                            _react2.default.createElement(
                                'h2',
                                { className: 'g-a-main-menu-sub-title' },
                                _react2.default.createElement(
                                    'a',
                                    { className: '', href: '' },
                                    this.props.user.fullName
                                ),
                                _react2.default.createElement(
                                    'span',
                                    { className: 'g-a-main-menu-sign-out' },
                                    _react2.default.createElement(
                                        'a',
                                        { href: '', onClick: this.handleSignOut },
                                        'Sign Out'
                                    )
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'button',
                    {
                        className: "g-a-main-menu-btn" + (this.state.menuIsOpen ? " g-a-main-menu-btn-open" : " g-a-main-menu-btn-close"),
                        onClick: this.handleMenuOpenCloseClick },
                    _react2.default.createElement('i', { className: 'gocms-icon-menu' })
                )
            );
        }
    }]);
    return BasicComponent;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {
        user: state.auth.user
    };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(BasicComponent);

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.actions.js", function(exports, require, module) {
"use strict";

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.container.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DashboardPage = function (_React$Component) {
    (0, _inherits3.default)(DashboardPage, _React$Component);

    function DashboardPage(props) {
        (0, _classCallCheck3.default)(this, DashboardPage);

        var _this = (0, _possibleConstructorReturn3.default)(this, (DashboardPage.__proto__ || (0, _getPrototypeOf2.default)(DashboardPage)).call(this, props));

        _this.state = {};
        return _this;
    }

    (0, _createClass3.default)(DashboardPage, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'h1',
                null,
                'dashboard'
            );
        }
    }]);
    return DashboardPage;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(DashboardPage);

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.reducers.js", function(exports, require, module) {
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
"use strict";

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.reducers.selectors.js", function(exports, require, module) {
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
"use strict";

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _dashboardPage = require('./dashboardPage.container');

var _dashboardPage2 = _interopRequireDefault(_dashboardPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createElement(
    _reactRouter.Route,
    null,
    _react2.default.createElement(_reactRouter.Route, { path: 'dashboard', component: _dashboardPage2.default })
);

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.sagas.js", function(exports, require, module) {
// import {fork, takeEvery, put, call} from 'redux-saga/effects';
// import * as apiActions from '../../../base/actions/apiRequestActions'; // importing our action
// import {login} from '../../config/actions/authenticationActions'
// import {Post, ENDPOINTS} from '../../../base/services/api';
// import { browserHistory } from 'react-router'
//
//
// // watch for login requests
// function* watchLoginSaga() {
//     yield takeEvery(apiActions.REQUEST, handleLoginSaga); // see details what is REQUEST param below
// }
//
// function* handleLoginSaga(action) {
//     let {res, err} = yield call(Post, ENDPOINTS.login, action.data); // calling our api method
//     if (res) {
//         // push user info to store
//         yield put(login(res.json));
//         yield put(apiActions.purge(action.key));
//         browserHistory.push(GOCMS_LOGIN_SUCCESS_REDIRECT);
//     }
//     else if (err) {
//         // fetch page data based on uri
//         yield put(apiActions.failure(action.key, err));
//     }
// }
//
// export default function* loginPageSagas() {
//     yield [
//         fork(watchLoginSaga),
//     ];
// }
"use strict";

});

require.register("gocms/admin/containers/devTools/DevTools.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reduxDevtools = require('redux-devtools');

var _reduxDevtoolsLogMonitor = require('redux-devtools-log-monitor');

var _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);

var _reduxDevtoolsDockMonitor = require('redux-devtools-dock-monitor');

var _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// DOCS: https://github.com/gaearon/redux-devtools

// createDevTools takes a monitor and produces a DevTools component
var DevTools = (0, _reduxDevtools.createDevTools)(_react2.default.createElement(
    _reduxDevtoolsDockMonitor2.default,
    { toggleVisibilityKey: 'ctrl-h',
        changePositionKey: 'ctrl-q',
        defaultPosition: 'left' },
    _react2.default.createElement(_reduxDevtoolsLogMonitor2.default, { theme: 'tomorrow' })
));

exports.default = DevTools;

});

require.register("gocms/admin/containers/loginPage/loginPage.actions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gocms_login = gocms_login;
var GOCMS_LOGIN = exports.GOCMS_LOGIN = 'GOCMS_LOGIN';

function gocms_login(key, data) {
    return {
        type: GOCMS_LOGIN,
        key: key,
        data: data,
        requestedAt: Date.now()
    };
}

});

;require.register("gocms/admin/containers/loginPage/loginPage.container.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

var _reactRedux = require('react-redux');

var _loginPage = require('./loginPage.actions');

var _GForm = require('../../../base/components/gForm/GForm');

var _GForm2 = _interopRequireDefault(_GForm);

var _GInput = require('../../../base/components/gForm/GInput');

var _GInput2 = _interopRequireDefault(_GInput);

var _GError = require('../../../base/components/gForm/GError');

var _GError2 = _interopRequireDefault(_GError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOGIN_FORM = "GOCMS_LOGIN_FORM";

var LoginPage = function (_React$Component) {
    (0, _inherits3.default)(LoginPage, _React$Component);

    function LoginPage(props) {
        (0, _classCallCheck3.default)(this, LoginPage);

        var _this = (0, _possibleConstructorReturn3.default)(this, (LoginPage.__proto__ || (0, _getPrototypeOf2.default)(LoginPage)).call(this, props));

        _this.state = {
            shake: false
        };
        _this.handleSubmit = _this.handleSubmit.bind(_this); //bind function once
        return _this;
    }

    (0, _createClass3.default)(LoginPage, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.err && nextProps.reqTime != this.props.reqTime) {
                this.setState({ shake: true });
            }
            if (!!nextProps.errMessage && nextProps.errMessage != this.state.errMessage) {
                this.setState({ errMessage: nextProps.errMessage });
            }
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(model) {
            this.props.gocms_login(LOGIN_FORM, model);
            this.setState({ errMessage: null });
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { className: 'g-a' },
                _react2.default.createElement(
                    'div',
                    { id: 'container-login-page' },
                    _react2.default.createElement(
                        'div',
                        { id: 'container-login-page-form', className: 'g-container-col' },
                        _react2.default.createElement(
                            'div',
                            { className: 'wrapper-login-form', noValidate: true },
                            _react2.default.createElement(
                                'div',
                                { className: 'g-container-col' },
                                _react2.default.createElement(
                                    'h1',
                                    { className: 'text-center no-padding no-margin' },
                                    GOCMS_LOGIN_TITLE
                                ),
                                _react2.default.createElement(
                                    _GForm2.default,
                                    { id: 'main-login-form', className: 'main-login-form', name: 'main-login-form',
                                        onSubmit: this.handleSubmit,
                                        submitBtn: 'Log In',
                                        submitBtnClassName: "btn-default",
                                        submitBtnShake: this.state.shake },
                                    _react2.default.createElement(_GInput2.default, { id: 'email', name: 'email', type: 'text', label: 'Email', validations: 'isEmail',
                                        validationError: 'Please enter a valid email.', required: true }),
                                    _react2.default.createElement(_GInput2.default, { id: 'password', name: 'password', type: 'password', label: 'Password',
                                        required: true })
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'g-col' },
                                    _react2.default.createElement(_GError2.default, {
                                        className: 'error-message-login',
                                        errMessage: this.state.errMessage
                                    })
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);
    return LoginPage;
}(_react2.default.Component);

function mapStateToProps(state) {
    var errMessage = void 0;
    var err = void 0;
    var reqTime = void 0;
    var req = state.api.request[LOGIN_FORM];
    if (!!req) {
        reqTime = req.receivedAt;
        if (!!req.err) {
            err = req.err;
            if (!!err.json && !!err.json.message) {
                errMessage = err.json.message;
            }
        }
    }
    return {
        reqTime: reqTime,
        err: err,
        errMessage: errMessage
    };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {
    gocms_login: _loginPage.gocms_login
})(LoginPage);

});

require.register("gocms/admin/containers/loginPage/loginPage.reducers.js", function(exports, require, module) {
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
"use strict";

});

require.register("gocms/admin/containers/loginPage/loginPage.reducers.selectors.js", function(exports, require, module) {
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
"use strict";

});

require.register("gocms/admin/containers/loginPage/loginPage.routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _loginPage = require('./loginPage.container');

var _loginPage2 = _interopRequireDefault(_loginPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createElement(_reactRouter.Route, { path: 'login', component: _loginPage2.default });

});

require.register("gocms/admin/containers/loginPage/loginPage.sagas.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = loginPageSagas;

var _effects = require('redux-saga/effects');

var _loginPage = require('./loginPage.actions');

var loginActions = _interopRequireWildcard(_loginPage);

var _apiRequestActions = require('../../../base/actions/apiRequestActions');

var apiActions = _interopRequireWildcard(_apiRequestActions);

var _api = require('../../../base/services/api');

var _authentication = require('../../services/authentication');

var _reactRouter = require('react-router');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [watchLoginSaga, handleLoginSaga, loginPageSagas].map(_regenerator2.default.mark);

// watch for login requests
function watchLoginSaga() {
    return _regenerator2.default.wrap(function watchLoginSaga$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return (0, _effects.takeEvery)(loginActions.GOCMS_LOGIN, handleLoginSaga);

                case 2:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

function handleLoginSaga(action) {
    var _ref, res, err;

    return _regenerator2.default.wrap(function handleLoginSaga$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return (0, _effects.call)(_api.Post, _api.ENDPOINTS.login, action.data);

                case 2:
                    _ref = _context2.sent;
                    res = _ref.res;
                    err = _ref.err;

                    if (!res) {
                        _context2.next = 15;
                        break;
                    }

                    _context2.next = 8;
                    return (0, _effects.call)(_authentication.addUserToSession, res.json);

                case 8:
                    _context2.next = 10;
                    return (0, _effects.call)(_authentication.syncSessionUserToState);

                case 10:
                    _context2.next = 12;
                    return (0, _effects.put)(apiActions.purge(action.key));

                case 12:
                    _reactRouter.browserHistory.push(GOCMS_LOGIN_SUCCESS_REDIRECT);
                    _context2.next = 18;
                    break;

                case 15:
                    if (!err) {
                        _context2.next = 18;
                        break;
                    }

                    _context2.next = 18;
                    return (0, _effects.put)(apiActions.failure(action.key, err));

                case 18:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked[1], this);
}

function loginPageSagas() {
    return _regenerator2.default.wrap(function loginPageSagas$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.next = 2;
                    return [(0, _effects.fork)(watchLoginSaga)];

                case 2:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _marked[2], this);
}

});

;require.register("gocms/admin/init.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getModule = getModule;
exports.injectModule = injectModule;

var _sagas = require('./config/sagas');

var _sagas2 = _interopRequireDefault(_sagas);

var _routes = require('./config/router/routes');

var _reducers = require('./config/reducers/reducers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getModule() {
    return {
        name: "goCMS Admin",
        sagas: _sagas2.default,
        routes: (0, _routes.registeredRoutes)(),
        reducers: (0, _reducers.registeredReducers)()
    };
};

function injectModule(a) {
    (0, _sagas.injectSagas)(a.sagas);
    (0, _routes.injectRoutes)(a.routes);
    (0, _reducers.injectReducers)(a.reducers);
}

});

;require.register("gocms/admin/services/authentication.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.USER_DATA_STORAGE_KEY = exports.DEVICE_TOKEN_HEADER = exports.AUTH_TOKEN_HEADER = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.syncSessionUserToState = syncSessionUserToState;
exports.addUserToSession = addUserToSession;
exports.getUserFromSession = getUserFromSession;
exports.removeUserFromSession = removeUserFromSession;
exports.logout = logout;
exports.requireAuthUser = requireAuthUser;

var _jwtDecode = require('jwt-decode');

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

var _authenticationActions = require('../config/actions/authenticationActions');

var _init = require('../../base/init');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AUTH_TOKEN_HEADER = exports.AUTH_TOKEN_HEADER = 'X-Auth-Token';
var DEVICE_TOKEN_HEADER = exports.DEVICE_TOKEN_HEADER = 'X-Device-Token';
var USER_DATA_STORAGE_KEY = exports.USER_DATA_STORAGE_KEY = 'USER_DATA_STORAGE_KEY';

function syncSessionUserToState() {
    var sessionUser = getUserFromSession();
    (0, _init.getStore)().dispatch((0, _authenticationActions.saveUserToState)(sessionUser));
}

function addUserToSession(userData) {
    sessionStorage.setItem(USER_DATA_STORAGE_KEY, (0, _stringify2.default)(userData));
}

function getUserFromSession() {
    return JSON.parse(sessionStorage.getItem(USER_DATA_STORAGE_KEY));
}

function removeUserFromSession() {
    sessionStorage.removeItem(AUTH_TOKEN_HEADER);
}

function logout() {
    (0, _init.getStore)().dispatch((0, _authenticationActions.removeUserFromState)());
    removeUserFromSession();
}

function requireAuthUser(nextState, replace) {
    // look for token in session
    var token = sessionStorage.getItem(AUTH_TOKEN_HEADER);

    // verify token exists
    if (!token) {
        logout();
        replace({
            pathname: '/login'
        });
        return;
    }

    // verify token has not expired
    var jwtData = (0, _jwtDecode2.default)(token);
    var timeDif = jwtData.exp - new Date().getTime();
    if (timeDif <= 0) {
        logout();
        replace({
            pathname: '/login'
        });
        return;
    }

    // verify token matches users
    var authUser = getUserFromSession();
    if (jwtData.userId !== authUser.id) {
        logout();
        replace({
            pathname: '/login'
        });
    }

    syncSessionUserToState();
}

});

;require.register("gocms/admin/templates/admin_tmpl.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _MainMenu = require('../containers/adminPages/components/mainMenu/MainMenu');

var _MainMenu2 = _interopRequireDefault(_MainMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AdminTemplate = function (_React$Component) {
    (0, _inherits3.default)(AdminTemplate, _React$Component);

    function AdminTemplate(props) {
        (0, _classCallCheck3.default)(this, AdminTemplate);
        return (0, _possibleConstructorReturn3.default)(this, (AdminTemplate.__proto__ || (0, _getPrototypeOf2.default)(AdminTemplate)).call(this, props));
    }

    (0, _createClass3.default)(AdminTemplate, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'g-a' },
                _react2.default.createElement(_MainMenu2.default, null),
                _react2.default.createElement(
                    'div',
                    { id: 'g-a-main-container' },
                    this.props.children
                )
            );
        }
    }]);
    return AdminTemplate;
}(_react2.default.Component);

AdminTemplate.propTypes = {
    children: _react.PropTypes.node
};

function mapStateToProps(state, ownProps) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(AdminTemplate);

});

require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluL2NvbXBvbmVudHMvYmFzaWNDb21wb25lbnQvQmFzaWNDb21wb25lbnQuanMiLCJhZG1pbi9jb25maWcvYWN0aW9ucy9hdXRoZW50aWNhdGlvbkFjdGlvbnMuanMiLCJhZG1pbi9jb25maWcvcmVkdWNlcnMvYXV0aGVudGljYXRpb25SZWR1Y2Vycy5qcyIsImFkbWluL2NvbmZpZy9yZWR1Y2Vycy9yZWR1Y2Vycy5qcyIsImFkbWluL2NvbmZpZy9yb3V0ZXIvcm91dGVzLmpzIiwiYWRtaW4vY29uZmlnL3NhZ2FzLmpzIiwiYWRtaW4vY29udGFpbmVycy9hZG1pblBhZ2VzL2FkbWluUGFnZXMucm91dGVzLmpzIiwiYWRtaW4vY29udGFpbmVycy9hZG1pblBhZ2VzL2NvbXBvbmVudHMvbWFpbk1lbnUvTWFpbk1lbnUuanMiLCJhZG1pbi9jb250YWluZXJzL2FkbWluUGFnZXMvZGFzaGJvYXJkUGFnZS9kYXNoYm9hcmRQYWdlLmFjdGlvbnMuanMiLCJhZG1pbi9jb250YWluZXJzL2FkbWluUGFnZXMvZGFzaGJvYXJkUGFnZS9kYXNoYm9hcmRQYWdlLmNvbnRhaW5lci5qcyIsImFkbWluL2NvbnRhaW5lcnMvYWRtaW5QYWdlcy9kYXNoYm9hcmRQYWdlL2Rhc2hib2FyZFBhZ2UucmVkdWNlcnMuanMiLCJhZG1pbi9jb250YWluZXJzL2FkbWluUGFnZXMvZGFzaGJvYXJkUGFnZS9kYXNoYm9hcmRQYWdlLnJlZHVjZXJzLnNlbGVjdG9ycy5qcyIsImFkbWluL2NvbnRhaW5lcnMvYWRtaW5QYWdlcy9kYXNoYm9hcmRQYWdlL2Rhc2hib2FyZFBhZ2Uucm91dGVzLmpzIiwiYWRtaW4vY29udGFpbmVycy9hZG1pblBhZ2VzL2Rhc2hib2FyZFBhZ2UvZGFzaGJvYXJkUGFnZS5zYWdhcy5qcyIsImFkbWluL2NvbnRhaW5lcnMvZGV2VG9vbHMvRGV2VG9vbHMuanMiLCJhZG1pbi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2UuYWN0aW9ucy5qcyIsImFkbWluL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5jb250YWluZXIuanMiLCJhZG1pbi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2UucmVkdWNlcnMuanMiLCJhZG1pbi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2UucmVkdWNlcnMuc2VsZWN0b3JzLmpzIiwiYWRtaW4vY29udGFpbmVycy9sb2dpblBhZ2UvbG9naW5QYWdlLnJvdXRlcy5qcyIsImFkbWluL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5zYWdhcy5qcyIsImFkbWluL2luaXQuanMiLCJhZG1pbi9zZXJ2aWNlcy9hdXRoZW50aWNhdGlvbi5qcyIsImFkbWluL3RlbXBsYXRlcy9hZG1pbl90bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5FQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2QkE7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTNDQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBeENBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcENBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTVDQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEvQ0E7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBL0lBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTNFQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdDQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsREE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdkJBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhDQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbENBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoQkE7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXpLQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTdDQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsREE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5CQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2SEE7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaENBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXpGQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNUVBO0FBQUEiLCJmaWxlIjoiLi4vYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEJhc2ljQ29tcG9uZW50ID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBCYXNpY0NvbXBvbmVudChwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBCYXNpY0NvbXBvbmVudCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoQmFzaWNDb21wb25lbnQuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEJhc2ljQ29tcG9uZW50KSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge307XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAncCcsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdiYXNpYy1jb21wb25lbnQnIH0sXG4gICAgICAgICAgICAgICAgJ0Jhc2ljIENvbXBvbmVudCdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEJhc2ljQ29tcG9uZW50O1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gICAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7fSkoQmFzaWNDb21wb25lbnQpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnNhdmVVc2VyVG9TdGF0ZSA9IHNhdmVVc2VyVG9TdGF0ZTtcbmV4cG9ydHMucmVtb3ZlVXNlckZyb21TdGF0ZSA9IHJlbW92ZVVzZXJGcm9tU3RhdGU7XG52YXIgU0FWRV9VU0VSX1RPX1NUQVRFID0gZXhwb3J0cy5TQVZFX1VTRVJfVE9fU1RBVEUgPSAnU0FWRV9VU0VSX1RPX1NUQVRFJztcbnZhciBSRU1PVkVfVVNFUl9GUk9NX1NUQVRFID0gZXhwb3J0cy5SRU1PVkVfVVNFUl9GUk9NX1NUQVRFID0gJ1JFTU9WRV9VU0VSX0ZST01fU1RBVEUnO1xuXG5mdW5jdGlvbiBzYXZlVXNlclRvU3RhdGUodXNlcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFNBVkVfVVNFUl9UT19TVEFURSxcbiAgICAgICAgdXNlcjogdXNlcixcbiAgICAgICAgbG9nZ2VkSW5BdDogRGF0ZS5ub3coKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVVzZXJGcm9tU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogUkVNT1ZFX1VTRVJfRlJPTV9TVEFURVxuICAgIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9leHRlbmRzJyk7XG5cbnZhciBfZXh0ZW5kczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbmRzMik7XG5cbnZhciBfcmVkdXggPSByZXF1aXJlKCdyZWR1eCcpO1xuXG52YXIgX2F1dGhlbnRpY2F0aW9uQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvYXV0aGVudGljYXRpb25BY3Rpb25zJyk7XG5cbnZhciBhY3Rpb25zID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2F1dGhlbnRpY2F0aW9uQWN0aW9ucyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGF1dGhlbnRpY2F0aW9uUmVkdWNlcigpIHtcbiAgICB2YXIgc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgYWN0aW9ucy5TQVZFX1VTRVJfVE9fU1RBVEU6XG4gICAgICAgICAgICByZXR1cm4gKDAsIF9leHRlbmRzMy5kZWZhdWx0KSh7fSwgc3RhdGUsIGFjdGlvbi51c2VyLCB7XG4gICAgICAgICAgICAgICAgbG9nZ2VkSW5BdDogYWN0aW9uLmxvZ2dlZEluQXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIGFjdGlvbnMuUkVNT1ZFX1VTRVJfRlJPTV9TVEFURTpcbiAgICAgICAgICAgIHZhciBzID0gKDAsIF9leHRlbmRzMy5kZWZhdWx0KSh7fSwgc3RhdGUpO1xuICAgICAgICAgICAgZGVsZXRlIHNbJ3VzZXInXTtcbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cblxudmFyIGF1dGhlbnRpY2F0aW9uUmVkdWNlcnMgPSAoMCwgX3JlZHV4LmNvbWJpbmVSZWR1Y2Vycykoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW9uUmVkdWNlclxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGF1dGhlbnRpY2F0aW9uUmVkdWNlcnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9leHRlbmRzJyk7XG5cbnZhciBfZXh0ZW5kczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbmRzMik7XG5cbnZhciBfYXNzaWduID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24nKTtcblxudmFyIF9hc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXNzaWduKTtcblxuZXhwb3J0cy5pbmplY3RSZWR1Y2VycyA9IGluamVjdFJlZHVjZXJzO1xuZXhwb3J0cy5yZWdpc3RlcmVkUmVkdWNlcnMgPSByZWdpc3RlcmVkUmVkdWNlcnM7XG5cbnZhciBfcmVhY3RSb3V0ZXJSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlci1yZWR1eCcpO1xuXG52YXIgX2F1dGhlbnRpY2F0aW9uUmVkdWNlcnMgPSByZXF1aXJlKCcuL2F1dGhlbnRpY2F0aW9uUmVkdWNlcnMnKTtcblxudmFyIF9hdXRoZW50aWNhdGlvblJlZHVjZXJzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2F1dGhlbnRpY2F0aW9uUmVkdWNlcnMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaW5qZWN0ZWRSZWR1Y2VycyA9IHt9O1xuXG5mdW5jdGlvbiBpbmplY3RSZWR1Y2VycyhyKSB7XG4gICAgaW5qZWN0ZWRSZWR1Y2VycyA9ICgwLCBfYXNzaWduMi5kZWZhdWx0KSh7fSwgciwgaW5qZWN0ZWRSZWR1Y2Vycyk7XG59XG5cbnZhciByb290UmVkdWNlcnMgPSAoMCwgX2V4dGVuZHMzLmRlZmF1bHQpKHtcbiAgICBhdXRoOiBfYXV0aGVudGljYXRpb25SZWR1Y2VyczIuZGVmYXVsdFxufSwgaW5qZWN0ZWRSZWR1Y2Vycywge1xuICAgIHJvdXRpbmc6IF9yZWFjdFJvdXRlclJlZHV4LnJvdXRlclJlZHVjZXJcbn0pO1xuXG5mdW5jdGlvbiByZWdpc3RlcmVkUmVkdWNlcnMoKSB7XG4gICAgcmV0dXJuIHJvb3RSZWR1Y2Vycztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5pbmplY3RSb3V0ZXMgPSBpbmplY3RSb3V0ZXM7XG5leHBvcnRzLnJlZ2lzdGVyZWRSb3V0ZXMgPSByZWdpc3RlcmVkUm91dGVzO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxudmFyIF9sb2dpblBhZ2UgPSByZXF1aXJlKCcuLi8uLi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2Uucm91dGVzJyk7XG5cbnZhciBfbG9naW5QYWdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZ2luUGFnZSk7XG5cbnZhciBfYWRtaW5QYWdlcyA9IHJlcXVpcmUoJy4uLy4uL2NvbnRhaW5lcnMvYWRtaW5QYWdlcy9hZG1pblBhZ2VzLnJvdXRlcycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgcm91dGVzID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgX3JlYWN0Um91dGVyLlJvdXRlLFxuICAgIG51bGwsXG4gICAgKDAsIF9hZG1pblBhZ2VzLnJlZ2lzdGVyZWRBZG1pblJvdXRlcykoKSxcbiAgICBfbG9naW5QYWdlMi5kZWZhdWx0XG4pO1xuXG5mdW5jdGlvbiBpbmplY3RSb3V0ZXMocikge1xuICAgICgwLCBfYWRtaW5QYWdlcy5pbmplY3RBZG1pblJvdXRlcykocik7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyZWRSb3V0ZXMoKSB7XG4gICAgcmV0dXJuIHJvdXRlcztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3JlZ2VuZXJhdG9yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvcicpO1xuXG52YXIgX3JlZ2VuZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZ2VuZXJhdG9yKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gcm9vdFNhZ2E7XG5leHBvcnRzLmluamVjdFNhZ2FzID0gaW5qZWN0U2FnYXM7XG5cbnZhciBfZWZmZWN0cyA9IHJlcXVpcmUoJ3JlZHV4LXNhZ2EvZWZmZWN0cycpO1xuXG52YXIgX2xvZ2luUGFnZSA9IHJlcXVpcmUoJy4uL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5zYWdhcycpO1xuXG52YXIgX2xvZ2luUGFnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2dpblBhZ2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgX21hcmtlZCA9IFtyb290U2FnYV0ubWFwKF9yZWdlbmVyYXRvcjIuZGVmYXVsdC5tYXJrKTtcblxudmFyIGluamVjdGVkU2FnYXMgPSBbXTtcblxuZnVuY3Rpb24gcm9vdFNhZ2EoKSB7XG4gICAgcmV0dXJuIF9yZWdlbmVyYXRvcjIuZGVmYXVsdC53cmFwKGZ1bmN0aW9uIHJvb3RTYWdhJChfY29udGV4dCkge1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbKDAsIF9lZmZlY3RzLmZvcmspKF9sb2dpblBhZ2UyLmRlZmF1bHQpXS5jb25jYXQoaW5qZWN0ZWRTYWdhcyk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIF9tYXJrZWRbMF0sIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBpbmplY3RTYWdhcyhzKSB7XG4gICAgaW5qZWN0ZWRTYWdhcy5wdXNoKCgwLCBfZWZmZWN0cy5mb3JrKShzKSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaW5qZWN0QWRtaW5Sb3V0ZXMgPSBpbmplY3RBZG1pblJvdXRlcztcbmV4cG9ydHMucmVnaXN0ZXJlZEFkbWluUm91dGVzID0gcmVnaXN0ZXJlZEFkbWluUm91dGVzO1xuXG52YXIgX2F1dGhlbnRpY2F0aW9uID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvYXV0aGVudGljYXRpb24nKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2Rhc2hib2FyZFBhZ2UgPSByZXF1aXJlKCcuL2Rhc2hib2FyZFBhZ2UvZGFzaGJvYXJkUGFnZS5yb3V0ZXMnKTtcblxudmFyIF9kYXNoYm9hcmRQYWdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rhc2hib2FyZFBhZ2UpO1xuXG52YXIgX2FkbWluX3RtcGwgPSByZXF1aXJlKCcuLi8uLi90ZW1wbGF0ZXMvYWRtaW5fdG1wbCcpO1xuXG52YXIgX2FkbWluX3RtcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYWRtaW5fdG1wbCk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGluamVjdGVkUm91dGVzID0gW107XG5cbnZhciByb3V0ZXMgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICBfcmVhY3RSb3V0ZXIuUm91dGUsXG4gICAgbnVsbCxcbiAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3RSb3V0ZXIuUmVkaXJlY3QsIHsgZnJvbTogJ2FkbWluJywgdG86ICdhZG1pbi9kYXNoYm9hcmQnIH0pLFxuICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBfcmVhY3RSb3V0ZXIuUm91dGUsXG4gICAgICAgIHsgcGF0aDogJ2FkbWluJywgY29tcG9uZW50OiBfYWRtaW5fdG1wbDIuZGVmYXVsdCwgb25FbnRlcjogX2F1dGhlbnRpY2F0aW9uLnJlcXVpcmVBdXRoVXNlciB9LFxuICAgICAgICBfZGFzaGJvYXJkUGFnZTIuZGVmYXVsdCxcbiAgICAgICAgaW5qZWN0ZWRSb3V0ZXNcbiAgICApXG4pO1xuXG5mdW5jdGlvbiBpbmplY3RBZG1pblJvdXRlcyhyKSB7XG4gICAgaW5qZWN0ZWRSb3V0ZXMucHVzaChyKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJlZEFkbWluUm91dGVzKCkge1xuICAgIHJldHVybiByb3V0ZXM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxudmFyIF9hdXRoZW50aWNhdGlvbiA9IHJlcXVpcmUoJy4uLy4uLy4uLy4uL3NlcnZpY2VzL2F1dGhlbnRpY2F0aW9uJyk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEJhc2ljQ29tcG9uZW50ID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBCYXNpY0NvbXBvbmVudChwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBCYXNpY0NvbXBvbmVudCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoQmFzaWNDb21wb25lbnQuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEJhc2ljQ29tcG9uZW50KSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLmhhbmRsZU1lbnVPcGVuQ2xvc2VDbGljayA9IF90aGlzLmhhbmRsZU1lbnVPcGVuQ2xvc2VDbGljay5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuaGFuZGxlU2lnbk91dCA9IF90aGlzLmhhbmRsZVNpZ25PdXQuYmluZChfdGhpcyk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtZW51SXNPcGVuOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGFuZGxlU2lnbk91dCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVTaWduT3V0KGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICgwLCBfYXV0aGVudGljYXRpb24ubG9nb3V0KSgpO1xuICAgICAgICAgICAgX3JlYWN0Um91dGVyLmJyb3dzZXJIaXN0b3J5LnB1c2goXCIvbG9naW5cIik7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhbmRsZU1lbnVPcGVuQ2xvc2VDbGljaycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVNZW51T3BlbkNsb3NlQ2xpY2soZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1lbnVJc09wZW46ICF0aGlzLnN0YXRlLm1lbnVJc09wZW4gfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInVzZXI6IFwiLCB0aGlzLnN0YXRlLnVzZXIpO1xuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZy1jb250YWluZXIgZy1hLW1haW4tbWVudS1jb250YWluZXJcIiArICh0aGlzLnN0YXRlLm1lbnVJc09wZW4gPyBcIiBnLWEtbWFpbi1tZW51LWNvbnRhaW5lci1vcGVuXCIgOiBcIiBnLWEtbWFpbi1tZW51LWNvbnRhaW5lci1jbG9zZVwiKSB9LFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJnLWNvbnRhaW5lciBnLWEtbWFpbi1tZW51LXRpdGxlLWNvbnRhaW5lclwiICsgKHRoaXMuc3RhdGUubWVudUlzT3BlbiA/IFwiIGctYS1tYWluLW1lbnUtdGl0bGUtY29udGFpbmVyLW9wZW5cIiA6IFwiIGctYS1tYWluLW1lbnUtdGl0bGUtY29udGFpbmVyLWNsb3NlXCIpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctYS1tYWluLW1lbnUtcHJvZmlsZS1pbWctY29udGFpbmVyJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJycsIGNsYXNzTmFtZTogJ2ctYS1tYWluLW1lbnUtcHJvZmlsZS1pbWcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdnb2Ntcy1pY29uLXVzZXInIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZy1jb250YWluZXItY29sJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaDEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctYS1tYWluLW1lbnUtdGl0bGUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdHb0NNUydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaDInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctYS1tYWluLW1lbnUtc3ViLXRpdGxlJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnJywgaHJlZjogJycgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMudXNlci5mdWxsTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZy1hLW1haW4tbWVudS1zaWduLW91dCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcnLCBvbkNsaWNrOiB0aGlzLmhhbmRsZVNpZ25PdXQgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU2lnbiBPdXQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImctYS1tYWluLW1lbnUtYnRuXCIgKyAodGhpcy5zdGF0ZS5tZW51SXNPcGVuID8gXCIgZy1hLW1haW4tbWVudS1idG4tb3BlblwiIDogXCIgZy1hLW1haW4tbWVudS1idG4tY2xvc2VcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmhhbmRsZU1lbnVPcGVuQ2xvc2VDbGljayB9LFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZ29jbXMtaWNvbi1tZW51JyB9KVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEJhc2ljQ29tcG9uZW50O1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdXNlcjogc3RhdGUuYXV0aC51c2VyXG4gICAgfTtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9yZWFjdFJlZHV4LmNvbm5lY3QpKG1hcFN0YXRlVG9Qcm9wcywge30pKEJhc2ljQ29tcG9uZW50KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZSgncmVhY3QtdHJhbnNpdGlvbi1ncm91cC9DU1NUcmFuc2l0aW9uR3JvdXAnKTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ1NTVHJhbnNpdGlvbkdyb3VwKTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIERhc2hib2FyZFBhZ2UgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKERhc2hib2FyZFBhZ2UsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gRGFzaGJvYXJkUGFnZShwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBEYXNoYm9hcmRQYWdlKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChEYXNoYm9hcmRQYWdlLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShEYXNoYm9hcmRQYWdlKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge307XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShEYXNoYm9hcmRQYWdlLCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnRXaWxsTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnaDEnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgJ2Rhc2hib2FyZCdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIERhc2hib2FyZFBhZ2U7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcbiAgICByZXR1cm4ge307XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfcmVhY3RSZWR1eC5jb25uZWN0KShtYXBTdGF0ZVRvUHJvcHMsIHt9KShEYXNoYm9hcmRQYWdlKTtcbiIsIi8vIGltcG9ydCB7Y29tYmluZVJlZHVjZXJzfSBmcm9tICdyZWR1eCdcbi8vIGltcG9ydCB7UkVRVUVTVF9QQUdFLCBSRUNFSVZFX1BBR0V9IGZyb20gJy4vaG9tZS5hY3Rpb25zJztcbi8vXG4vL1xuLy8gY29uc3QgaW5pdGlhbFN0YXRlID0ge307XG4vL1xuLy8gZnVuY3Rpb24gcGFnZShzdGF0ZSA9IHtcbi8vICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbi8vICAgICBpdGVtczogW11cbi8vIH0sIGFjdGlvbikge1xuLy8gICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbi8vICAgICAgICAgY2FzZSBSRVFVRVNUX1BBR0U6XG4vLyAgICAgICAgICAgICByZXR1cm4gey4uLnN0YXRlLCBpc0ZldGNoaW5nOiB0cnVlfTtcbi8vXG4vLyAgICAgICAgIGNhc2UgUkVDRUlWRV9QQUdFOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgICBjb250ZW50OiBhY3Rpb24uY29udGVudCxcbi8vICAgICAgICAgICAgICAgICBsYXN0VXBkYXRlZDogYWN0aW9uLnJlY2VpdmVkQXRcbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGRlZmF1bHQ6XG4vLyAgICAgICAgICAgICByZXR1cm4gc3RhdGVcbi8vICAgICB9XG4vLyB9XG4vL1xuLy8gZnVuY3Rpb24gcGFnZUJ5VXJpKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcbi8vICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4vLyAgICAgICAgIGNhc2UgUkVRVUVTVF9QQUdFOlxuLy8gICAgICAgICBjYXNlIFJFQ0VJVkVfUEFHRTpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgW2FjdGlvbi51cmldOiBwYWdlKHN0YXRlW2FjdGlvbi51cmldLCBhY3Rpb24pXG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBkZWZhdWx0OlxuLy8gICAgICAgICAgICAgcmV0dXJuIHN0YXRlXG4vLyAgICAgfVxuLy8gfVxuLy9cbi8vIGNvbnN0IHJvb3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcbi8vICAgICBwYWdlQnlVcmksXG4vLyB9KTtcbi8vXG4vLyBleHBvcnQgZGVmYXVsdCByb290UmVkdWNlclxuXCJ1c2Ugc3RyaWN0XCI7XG4iLCIvLyBpbXBvcnQge2NvbWJpbmVSZWR1Y2Vyc30gZnJvbSAncmVkdXgnXG4vLyBpbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4uLy4uL2NvbmZpZy9hY3Rpb25zL2Zvcm0nO1xuLy9cbi8vIGZ1bmN0aW9uIF9mb3JtUmVxdWVzdFJlZHVjZXIoc3RhdGUgPSB7fSwgYWN0aW9uKSB7XG4vLyAgICAgbGV0IGtleSA9IGFjdGlvbi5rZXk7XG4vLyAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuLy8gICAgICAgICBjYXNlIGFjdGlvbnMuUkVRVUVTVDpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgW2tleV06IHtcbi8vICAgICAgICAgICAgICAgICAgICAgLi4uc3RhdGVba2V5XSxcbi8vICAgICAgICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuLy8gICAgICAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ZWRBdDogYWN0aW9uLnJlcXVlc3RlZEF0XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgY2FzZSBhY3Rpb25zLlNVQ0NFU1M6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIFtrZXldOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIC4uLnN0YXRlW2tleV0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGtleTogYWN0aW9uLmtleSxcbi8vICAgICAgICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVkQXQ6IGFjdGlvbi5yZWNlaXZlZEF0LFxuLy8gICAgICAgICAgICAgICAgICAgICBkYXRhOiBhY3Rpb24uZGF0YVxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGNhc2UgYWN0aW9ucy5GQUlMVVJFOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBba2V5XToge1xuLy8gICAgICAgICAgICAgICAgICAgICAuLi5zdGF0ZVtrZXldLFxuLy8gICAgICAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4vLyAgICAgICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICByZWNlaXZlZEF0OiBhY3Rpb24ucmVjZWl2ZWRBdCxcbi8vICAgICAgICAgICAgICAgICAgICAgZXJyOiBhY3Rpb24uZXJyXG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgZGVmYXVsdDpcbi8vICAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuLy8gICAgIH1cbi8vIH1cbi8vXG4vL1xuLy8gY29uc3QgZm9ybVJlcXVlc3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcbi8vICAgICBfZm9ybVJlcXVlc3RSZWR1Y2VyLFxuLy8gfSk7XG4vL1xuLy8gZXhwb3J0IGRlZmF1bHQgZm9ybVJlcXVlc3RSZWR1Y2VyXG5cInVzZSBzdHJpY3RcIjtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxudmFyIF9kYXNoYm9hcmRQYWdlID0gcmVxdWlyZSgnLi9kYXNoYm9hcmRQYWdlLmNvbnRhaW5lcicpO1xuXG52YXIgX2Rhc2hib2FyZFBhZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGFzaGJvYXJkUGFnZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgIF9yZWFjdFJvdXRlci5Sb3V0ZSxcbiAgICBudWxsLFxuICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdFJvdXRlci5Sb3V0ZSwgeyBwYXRoOiAnZGFzaGJvYXJkJywgY29tcG9uZW50OiBfZGFzaGJvYXJkUGFnZTIuZGVmYXVsdCB9KVxuKTtcbiIsIi8vIGltcG9ydCB7Zm9yaywgdGFrZUV2ZXJ5LCBwdXQsIGNhbGx9IGZyb20gJ3JlZHV4LXNhZ2EvZWZmZWN0cyc7XG4vLyBpbXBvcnQgKiBhcyBhcGlBY3Rpb25zIGZyb20gJy4uLy4uLy4uL2Jhc2UvYWN0aW9ucy9hcGlSZXF1ZXN0QWN0aW9ucyc7IC8vIGltcG9ydGluZyBvdXIgYWN0aW9uXG4vLyBpbXBvcnQge2xvZ2lufSBmcm9tICcuLi8uLi9jb25maWcvYWN0aW9ucy9hdXRoZW50aWNhdGlvbkFjdGlvbnMnXG4vLyBpbXBvcnQge1Bvc3QsIEVORFBPSU5UU30gZnJvbSAnLi4vLi4vLi4vYmFzZS9zZXJ2aWNlcy9hcGknO1xuLy8gaW1wb3J0IHsgYnJvd3Nlckhpc3RvcnkgfSBmcm9tICdyZWFjdC1yb3V0ZXInXG4vL1xuLy9cbi8vIC8vIHdhdGNoIGZvciBsb2dpbiByZXF1ZXN0c1xuLy8gZnVuY3Rpb24qIHdhdGNoTG9naW5TYWdhKCkge1xuLy8gICAgIHlpZWxkIHRha2VFdmVyeShhcGlBY3Rpb25zLlJFUVVFU1QsIGhhbmRsZUxvZ2luU2FnYSk7IC8vIHNlZSBkZXRhaWxzIHdoYXQgaXMgUkVRVUVTVCBwYXJhbSBiZWxvd1xuLy8gfVxuLy9cbi8vIGZ1bmN0aW9uKiBoYW5kbGVMb2dpblNhZ2EoYWN0aW9uKSB7XG4vLyAgICAgbGV0IHtyZXMsIGVycn0gPSB5aWVsZCBjYWxsKFBvc3QsIEVORFBPSU5UUy5sb2dpbiwgYWN0aW9uLmRhdGEpOyAvLyBjYWxsaW5nIG91ciBhcGkgbWV0aG9kXG4vLyAgICAgaWYgKHJlcykge1xuLy8gICAgICAgICAvLyBwdXNoIHVzZXIgaW5mbyB0byBzdG9yZVxuLy8gICAgICAgICB5aWVsZCBwdXQobG9naW4ocmVzLmpzb24pKTtcbi8vICAgICAgICAgeWllbGQgcHV0KGFwaUFjdGlvbnMucHVyZ2UoYWN0aW9uLmtleSkpO1xuLy8gICAgICAgICBicm93c2VySGlzdG9yeS5wdXNoKEdPQ01TX0xPR0lOX1NVQ0NFU1NfUkVESVJFQ1QpO1xuLy8gICAgIH1cbi8vICAgICBlbHNlIGlmIChlcnIpIHtcbi8vICAgICAgICAgLy8gZmV0Y2ggcGFnZSBkYXRhIGJhc2VkIG9uIHVyaVxuLy8gICAgICAgICB5aWVsZCBwdXQoYXBpQWN0aW9ucy5mYWlsdXJlKGFjdGlvbi5rZXksIGVycikpO1xuLy8gICAgIH1cbi8vIH1cbi8vXG4vLyBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiogbG9naW5QYWdlU2FnYXMoKSB7XG4vLyAgICAgeWllbGQgW1xuLy8gICAgICAgICBmb3JrKHdhdGNoTG9naW5TYWdhKSxcbi8vICAgICBdO1xuLy8gfVxuXCJ1c2Ugc3RyaWN0XCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlZHV4RGV2dG9vbHMgPSByZXF1aXJlKCdyZWR1eC1kZXZ0b29scycpO1xuXG52YXIgX3JlZHV4RGV2dG9vbHNMb2dNb25pdG9yID0gcmVxdWlyZSgncmVkdXgtZGV2dG9vbHMtbG9nLW1vbml0b3InKTtcblxudmFyIF9yZWR1eERldnRvb2xzTG9nTW9uaXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1eERldnRvb2xzTG9nTW9uaXRvcik7XG5cbnZhciBfcmVkdXhEZXZ0b29sc0RvY2tNb25pdG9yID0gcmVxdWlyZSgncmVkdXgtZGV2dG9vbHMtZG9jay1tb25pdG9yJyk7XG5cbnZhciBfcmVkdXhEZXZ0b29sc0RvY2tNb25pdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4RGV2dG9vbHNEb2NrTW9uaXRvcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIERPQ1M6IGh0dHBzOi8vZ2l0aHViLmNvbS9nYWVhcm9uL3JlZHV4LWRldnRvb2xzXG5cbi8vIGNyZWF0ZURldlRvb2xzIHRha2VzIGEgbW9uaXRvciBhbmQgcHJvZHVjZXMgYSBEZXZUb29scyBjb21wb25lbnRcbnZhciBEZXZUb29scyA9ICgwLCBfcmVkdXhEZXZ0b29scy5jcmVhdGVEZXZUb29scykoX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgX3JlZHV4RGV2dG9vbHNEb2NrTW9uaXRvcjIuZGVmYXVsdCxcbiAgICB7IHRvZ2dsZVZpc2liaWxpdHlLZXk6ICdjdHJsLWgnLFxuICAgICAgICBjaGFuZ2VQb3NpdGlvbktleTogJ2N0cmwtcScsXG4gICAgICAgIGRlZmF1bHRQb3NpdGlvbjogJ2xlZnQnIH0sXG4gICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlZHV4RGV2dG9vbHNMb2dNb25pdG9yMi5kZWZhdWx0LCB7IHRoZW1lOiAndG9tb3Jyb3cnIH0pXG4pKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gRGV2VG9vbHM7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZ29jbXNfbG9naW4gPSBnb2Ntc19sb2dpbjtcbnZhciBHT0NNU19MT0dJTiA9IGV4cG9ydHMuR09DTVNfTE9HSU4gPSAnR09DTVNfTE9HSU4nO1xuXG5mdW5jdGlvbiBnb2Ntc19sb2dpbihrZXksIGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBHT0NNU19MT0dJTixcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIHJlcXVlc3RlZEF0OiBEYXRlLm5vdygpXG4gICAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mJyk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjaycpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzQ2FsbENoZWNrMik7XG5cbnZhciBfY3JlYXRlQ2xhc3MyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJyk7XG5cbnZhciBfY3JlYXRlQ2xhc3MzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2xhc3MyKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuJyk7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMik7XG5cbnZhciBfaW5oZXJpdHMyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzJyk7XG5cbnZhciBfaW5oZXJpdHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5oZXJpdHMyKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cCA9IHJlcXVpcmUoJ3JlYWN0LXRyYW5zaXRpb24tZ3JvdXAvQ1NTVHJhbnNpdGlvbkdyb3VwJyk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0NTU1RyYW5zaXRpb25Hcm91cCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbnZhciBfbG9naW5QYWdlID0gcmVxdWlyZSgnLi9sb2dpblBhZ2UuYWN0aW9ucycpO1xuXG52YXIgX0dGb3JtID0gcmVxdWlyZSgnLi4vLi4vLi4vYmFzZS9jb21wb25lbnRzL2dGb3JtL0dGb3JtJyk7XG5cbnZhciBfR0Zvcm0yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfR0Zvcm0pO1xuXG52YXIgX0dJbnB1dCA9IHJlcXVpcmUoJy4uLy4uLy4uL2Jhc2UvY29tcG9uZW50cy9nRm9ybS9HSW5wdXQnKTtcblxudmFyIF9HSW5wdXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfR0lucHV0KTtcblxudmFyIF9HRXJyb3IgPSByZXF1aXJlKCcuLi8uLi8uLi9iYXNlL2NvbXBvbmVudHMvZ0Zvcm0vR0Vycm9yJyk7XG5cbnZhciBfR0Vycm9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0dFcnJvcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBMT0dJTl9GT1JNID0gXCJHT0NNU19MT0dJTl9GT1JNXCI7XG5cbnZhciBMb2dpblBhZ2UgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKExvZ2luUGFnZSwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBMb2dpblBhZ2UocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgTG9naW5QYWdlKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChMb2dpblBhZ2UuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKExvZ2luUGFnZSkpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHNoYWtlOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5oYW5kbGVTdWJtaXQgPSBfdGhpcy5oYW5kbGVTdWJtaXQuYmluZChfdGhpcyk7IC8vYmluZCBmdW5jdGlvbiBvbmNlXG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShMb2dpblBhZ2UsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgICAgICAgICAgaWYgKCEhbmV4dFByb3BzLmVyciAmJiBuZXh0UHJvcHMucmVxVGltZSAhPSB0aGlzLnByb3BzLnJlcVRpbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hha2U6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoISFuZXh0UHJvcHMuZXJyTWVzc2FnZSAmJiBuZXh0UHJvcHMuZXJyTWVzc2FnZSAhPSB0aGlzLnN0YXRlLmVyck1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZXJyTWVzc2FnZTogbmV4dFByb3BzLmVyck1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhbmRsZVN1Ym1pdCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVTdWJtaXQobW9kZWwpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZ29jbXNfbG9naW4oTE9HSU5fRk9STSwgbW9kZWwpO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVyck1lc3NhZ2U6IG51bGwgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctYScgfSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgIHsgaWQ6ICdjb250YWluZXItbG9naW4tcGFnZScgfSxcbiAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgaWQ6ICdjb250YWluZXItbG9naW4tcGFnZS1mb3JtJywgY2xhc3NOYW1lOiAnZy1jb250YWluZXItY29sJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd3cmFwcGVyLWxvZ2luLWZvcm0nLCBub1ZhbGlkYXRlOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctY29udGFpbmVyLWNvbCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaDEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICd0ZXh0LWNlbnRlciBuby1wYWRkaW5nIG5vLW1hcmdpbicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdPQ01TX0xPR0lOX1RJVExFXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX0dGb3JtMi5kZWZhdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBpZDogJ21haW4tbG9naW4tZm9ybScsIGNsYXNzTmFtZTogJ21haW4tbG9naW4tZm9ybScsIG5hbWU6ICdtYWluLWxvZ2luLWZvcm0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU3VibWl0OiB0aGlzLmhhbmRsZVN1Ym1pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJtaXRCdG46ICdMb2cgSW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ0bkNsYXNzTmFtZTogXCJidG4tZGVmYXVsdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ0blNoYWtlOiB0aGlzLnN0YXRlLnNoYWtlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfR0lucHV0Mi5kZWZhdWx0LCB7IGlkOiAnZW1haWwnLCBuYW1lOiAnZW1haWwnLCB0eXBlOiAndGV4dCcsIGxhYmVsOiAnRW1haWwnLCB2YWxpZGF0aW9uczogJ2lzRW1haWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb25FcnJvcjogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsLicsIHJlcXVpcmVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0dJbnB1dDIuZGVmYXVsdCwgeyBpZDogJ3Bhc3N3b3JkJywgbmFtZTogJ3Bhc3N3b3JkJywgdHlwZTogJ3Bhc3N3b3JkJywgbGFiZWw6ICdQYXNzd29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZy1jb2wnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfR0Vycm9yMi5kZWZhdWx0LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZXJyb3ItbWVzc2FnZS1sb2dpbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyTWVzc2FnZTogdGhpcy5zdGF0ZS5lcnJNZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gTG9naW5QYWdlO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gICAgdmFyIGVyck1lc3NhZ2UgPSB2b2lkIDA7XG4gICAgdmFyIGVyciA9IHZvaWQgMDtcbiAgICB2YXIgcmVxVGltZSA9IHZvaWQgMDtcbiAgICB2YXIgcmVxID0gc3RhdGUuYXBpLnJlcXVlc3RbTE9HSU5fRk9STV07XG4gICAgaWYgKCEhcmVxKSB7XG4gICAgICAgIHJlcVRpbWUgPSByZXEucmVjZWl2ZWRBdDtcbiAgICAgICAgaWYgKCEhcmVxLmVycikge1xuICAgICAgICAgICAgZXJyID0gcmVxLmVycjtcbiAgICAgICAgICAgIGlmICghIWVyci5qc29uICYmICEhZXJyLmpzb24ubWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIGVyck1lc3NhZ2UgPSBlcnIuanNvbi5tZXNzYWdlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlcVRpbWU6IHJlcVRpbWUsXG4gICAgICAgIGVycjogZXJyLFxuICAgICAgICBlcnJNZXNzYWdlOiBlcnJNZXNzYWdlXG4gICAgfTtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9yZWFjdFJlZHV4LmNvbm5lY3QpKG1hcFN0YXRlVG9Qcm9wcywge1xuICAgIGdvY21zX2xvZ2luOiBfbG9naW5QYWdlLmdvY21zX2xvZ2luXG59KShMb2dpblBhZ2UpO1xuIiwiLy8gaW1wb3J0IHtjb21iaW5lUmVkdWNlcnN9IGZyb20gJ3JlZHV4J1xuLy8gaW1wb3J0IHtSRVFVRVNUX1BBR0UsIFJFQ0VJVkVfUEFHRX0gZnJvbSAnLi9ob21lLmFjdGlvbnMnO1xuLy9cbi8vXG4vLyBjb25zdCBpbml0aWFsU3RhdGUgPSB7fTtcbi8vXG4vLyBmdW5jdGlvbiBwYWdlKHN0YXRlID0ge1xuLy8gICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuLy8gICAgIGl0ZW1zOiBbXVxuLy8gfSwgYWN0aW9uKSB7XG4vLyAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuLy8gICAgICAgICBjYXNlIFJFUVVFU1RfUEFHRTpcbi8vICAgICAgICAgICAgIHJldHVybiB7Li4uc3RhdGUsIGlzRmV0Y2hpbmc6IHRydWV9O1xuLy9cbi8vICAgICAgICAgY2FzZSBSRUNFSVZFX1BBR0U6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGFjdGlvbi5jb250ZW50LFxuLy8gICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVkOiBhY3Rpb24ucmVjZWl2ZWRBdFxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgZGVmYXVsdDpcbi8vICAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuLy8gICAgIH1cbi8vIH1cbi8vXG4vLyBmdW5jdGlvbiBwYWdlQnlVcmkoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xuLy8gICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbi8vICAgICAgICAgY2FzZSBSRVFVRVNUX1BBR0U6XG4vLyAgICAgICAgIGNhc2UgUkVDRUlWRV9QQUdFOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBbYWN0aW9uLnVyaV06IHBhZ2Uoc3RhdGVbYWN0aW9uLnVyaV0sIGFjdGlvbilcbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGRlZmF1bHQ6XG4vLyAgICAgICAgICAgICByZXR1cm4gc3RhdGVcbi8vICAgICB9XG4vLyB9XG4vL1xuLy8gY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuLy8gICAgIHBhZ2VCeVVyaSxcbi8vIH0pO1xuLy9cbi8vIGV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyXG5cInVzZSBzdHJpY3RcIjtcbiIsIi8vIGltcG9ydCB7Y29tYmluZVJlZHVjZXJzfSBmcm9tICdyZWR1eCdcbi8vIGltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi4vLi4vY29uZmlnL2FjdGlvbnMvZm9ybSc7XG4vL1xuLy8gZnVuY3Rpb24gX2Zvcm1SZXF1ZXN0UmVkdWNlcihzdGF0ZSA9IHt9LCBhY3Rpb24pIHtcbi8vICAgICBsZXQga2V5ID0gYWN0aW9uLmtleTtcbi8vICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4vLyAgICAgICAgIGNhc2UgYWN0aW9ucy5SRVFVRVNUOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBba2V5XToge1xuLy8gICAgICAgICAgICAgICAgICAgICAuLi5zdGF0ZVtrZXldLFxuLy8gICAgICAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4vLyAgICAgICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RlZEF0OiBhY3Rpb24ucmVxdWVzdGVkQXRcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBjYXNlIGFjdGlvbnMuU1VDQ0VTUzpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgW2tleV06IHtcbi8vICAgICAgICAgICAgICAgICAgICAgLi4uc3RhdGVba2V5XSxcbi8vICAgICAgICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuLy8gICAgICAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZWRBdDogYWN0aW9uLnJlY2VpdmVkQXQsXG4vLyAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGFjdGlvbi5kYXRhXG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgY2FzZSBhY3Rpb25zLkZBSUxVUkU6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIFtrZXldOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIC4uLnN0YXRlW2tleV0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGtleTogYWN0aW9uLmtleSxcbi8vICAgICAgICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVkQXQ6IGFjdGlvbi5yZWNlaXZlZEF0LFxuLy8gICAgICAgICAgICAgICAgICAgICBlcnI6IGFjdGlvbi5lcnJcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBkZWZhdWx0OlxuLy8gICAgICAgICAgICAgcmV0dXJuIHN0YXRlXG4vLyAgICAgfVxuLy8gfVxuLy9cbi8vXG4vLyBjb25zdCBmb3JtUmVxdWVzdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuLy8gICAgIF9mb3JtUmVxdWVzdFJlZHVjZXIsXG4vLyB9KTtcbi8vXG4vLyBleHBvcnQgZGVmYXVsdCBmb3JtUmVxdWVzdFJlZHVjZXJcblwidXNlIHN0cmljdFwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xuXG52YXIgX2xvZ2luUGFnZSA9IHJlcXVpcmUoJy4vbG9naW5QYWdlLmNvbnRhaW5lcicpO1xuXG52YXIgX2xvZ2luUGFnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2dpblBhZ2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3RSb3V0ZXIuUm91dGUsIHsgcGF0aDogJ2xvZ2luJywgY29tcG9uZW50OiBfbG9naW5QYWdlMi5kZWZhdWx0IH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVnZW5lcmF0b3IgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yJyk7XG5cbnZhciBfcmVnZW5lcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVnZW5lcmF0b3IpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBsb2dpblBhZ2VTYWdhcztcblxudmFyIF9lZmZlY3RzID0gcmVxdWlyZSgncmVkdXgtc2FnYS9lZmZlY3RzJyk7XG5cbnZhciBfbG9naW5QYWdlID0gcmVxdWlyZSgnLi9sb2dpblBhZ2UuYWN0aW9ucycpO1xuXG52YXIgbG9naW5BY3Rpb25zID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2xvZ2luUGFnZSk7XG5cbnZhciBfYXBpUmVxdWVzdEFjdGlvbnMgPSByZXF1aXJlKCcuLi8uLi8uLi9iYXNlL2FjdGlvbnMvYXBpUmVxdWVzdEFjdGlvbnMnKTtcblxudmFyIGFwaUFjdGlvbnMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfYXBpUmVxdWVzdEFjdGlvbnMpO1xuXG52YXIgX2FwaSA9IHJlcXVpcmUoJy4uLy4uLy4uL2Jhc2Uvc2VydmljZXMvYXBpJyk7XG5cbnZhciBfYXV0aGVudGljYXRpb24gPSByZXF1aXJlKCcuLi8uLi9zZXJ2aWNlcy9hdXRoZW50aWNhdGlvbicpO1xuXG52YXIgX3JlYWN0Um91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBfbWFya2VkID0gW3dhdGNoTG9naW5TYWdhLCBoYW5kbGVMb2dpblNhZ2EsIGxvZ2luUGFnZVNhZ2FzXS5tYXAoX3JlZ2VuZXJhdG9yMi5kZWZhdWx0Lm1hcmspO1xuXG4vLyB3YXRjaCBmb3IgbG9naW4gcmVxdWVzdHNcbmZ1bmN0aW9uIHdhdGNoTG9naW5TYWdhKCkge1xuICAgIHJldHVybiBfcmVnZW5lcmF0b3IyLmRlZmF1bHQud3JhcChmdW5jdGlvbiB3YXRjaExvZ2luU2FnYSQoX2NvbnRleHQpIHtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQucHJldiA9IF9jb250ZXh0Lm5leHQpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAyO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VFdmVyeSkobG9naW5BY3Rpb25zLkdPQ01TX0xPR0lOLCBoYW5kbGVMb2dpblNhZ2EpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dC5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBfbWFya2VkWzBdLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlTG9naW5TYWdhKGFjdGlvbikge1xuICAgIHZhciBfcmVmLCByZXMsIGVycjtcblxuICAgIHJldHVybiBfcmVnZW5lcmF0b3IyLmRlZmF1bHQud3JhcChmdW5jdGlvbiBoYW5kbGVMb2dpblNhZ2EkKF9jb250ZXh0Mikge1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuY2FsbCkoX2FwaS5Qb3N0LCBfYXBpLkVORFBPSU5UUy5sb2dpbiwgYWN0aW9uLmRhdGEpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBfcmVmID0gX2NvbnRleHQyLnNlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IF9yZWYucmVzO1xuICAgICAgICAgICAgICAgICAgICBlcnIgPSBfcmVmLmVycjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSA4O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKF9hdXRoZW50aWNhdGlvbi5hZGRVc2VyVG9TZXNzaW9uLCByZXMuanNvbik7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTA7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuY2FsbCkoX2F1dGhlbnRpY2F0aW9uLnN5bmNTZXNzaW9uVXNlclRvU3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxMjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKGFwaUFjdGlvbnMucHVyZ2UoYWN0aW9uLmtleSkpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICAgICAgX3JlYWN0Um91dGVyLmJyb3dzZXJIaXN0b3J5LnB1c2goR09DTVNfTE9HSU5fU1VDQ0VTU19SRURJUkVDVCk7XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTg7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTg7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KShhcGlBY3Rpb25zLmZhaWx1cmUoYWN0aW9uLmtleSwgZXJyKSk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE4OlxuICAgICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDIuc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgX21hcmtlZFsxXSwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGxvZ2luUGFnZVNhZ2FzKCkge1xuICAgIHJldHVybiBfcmVnZW5lcmF0b3IyLmRlZmF1bHQud3JhcChmdW5jdGlvbiBsb2dpblBhZ2VTYWdhcyQoX2NvbnRleHQzKSB7XG4gICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0My5wcmV2ID0gX2NvbnRleHQzLm5leHQpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsoMCwgX2VmZmVjdHMuZm9yaykod2F0Y2hMb2dpblNhZ2EpXTtcblxuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLnN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIF9tYXJrZWRbMl0sIHRoaXMpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmdldE1vZHVsZSA9IGdldE1vZHVsZTtcbmV4cG9ydHMuaW5qZWN0TW9kdWxlID0gaW5qZWN0TW9kdWxlO1xuXG52YXIgX3NhZ2FzID0gcmVxdWlyZSgnLi9jb25maWcvc2FnYXMnKTtcblxudmFyIF9zYWdhczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zYWdhcyk7XG5cbnZhciBfcm91dGVzID0gcmVxdWlyZSgnLi9jb25maWcvcm91dGVyL3JvdXRlcycpO1xuXG52YXIgX3JlZHVjZXJzID0gcmVxdWlyZSgnLi9jb25maWcvcmVkdWNlcnMvcmVkdWNlcnMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gZ2V0TW9kdWxlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwiZ29DTVMgQWRtaW5cIixcbiAgICAgICAgc2FnYXM6IF9zYWdhczIuZGVmYXVsdCxcbiAgICAgICAgcm91dGVzOiAoMCwgX3JvdXRlcy5yZWdpc3RlcmVkUm91dGVzKSgpLFxuICAgICAgICByZWR1Y2VyczogKDAsIF9yZWR1Y2Vycy5yZWdpc3RlcmVkUmVkdWNlcnMpKClcbiAgICB9O1xufTtcblxuZnVuY3Rpb24gaW5qZWN0TW9kdWxlKGEpIHtcbiAgICAoMCwgX3NhZ2FzLmluamVjdFNhZ2FzKShhLnNhZ2FzKTtcbiAgICAoMCwgX3JvdXRlcy5pbmplY3RSb3V0ZXMpKGEucm91dGVzKTtcbiAgICAoMCwgX3JlZHVjZXJzLmluamVjdFJlZHVjZXJzKShhLnJlZHVjZXJzKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5VU0VSX0RBVEFfU1RPUkFHRV9LRVkgPSBleHBvcnRzLkRFVklDRV9UT0tFTl9IRUFERVIgPSBleHBvcnRzLkFVVEhfVE9LRU5fSEVBREVSID0gdW5kZWZpbmVkO1xuXG52YXIgX3N0cmluZ2lmeSA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeScpO1xuXG52YXIgX3N0cmluZ2lmeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpbmdpZnkpO1xuXG5leHBvcnRzLnN5bmNTZXNzaW9uVXNlclRvU3RhdGUgPSBzeW5jU2Vzc2lvblVzZXJUb1N0YXRlO1xuZXhwb3J0cy5hZGRVc2VyVG9TZXNzaW9uID0gYWRkVXNlclRvU2Vzc2lvbjtcbmV4cG9ydHMuZ2V0VXNlckZyb21TZXNzaW9uID0gZ2V0VXNlckZyb21TZXNzaW9uO1xuZXhwb3J0cy5yZW1vdmVVc2VyRnJvbVNlc3Npb24gPSByZW1vdmVVc2VyRnJvbVNlc3Npb247XG5leHBvcnRzLmxvZ291dCA9IGxvZ291dDtcbmV4cG9ydHMucmVxdWlyZUF1dGhVc2VyID0gcmVxdWlyZUF1dGhVc2VyO1xuXG52YXIgX2p3dERlY29kZSA9IHJlcXVpcmUoJ2p3dC1kZWNvZGUnKTtcblxudmFyIF9qd3REZWNvZGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfand0RGVjb2RlKTtcblxudmFyIF9hdXRoZW50aWNhdGlvbkFjdGlvbnMgPSByZXF1aXJlKCcuLi9jb25maWcvYWN0aW9ucy9hdXRoZW50aWNhdGlvbkFjdGlvbnMnKTtcblxudmFyIF9pbml0ID0gcmVxdWlyZSgnLi4vLi4vYmFzZS9pbml0Jyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBBVVRIX1RPS0VOX0hFQURFUiA9IGV4cG9ydHMuQVVUSF9UT0tFTl9IRUFERVIgPSAnWC1BdXRoLVRva2VuJztcbnZhciBERVZJQ0VfVE9LRU5fSEVBREVSID0gZXhwb3J0cy5ERVZJQ0VfVE9LRU5fSEVBREVSID0gJ1gtRGV2aWNlLVRva2VuJztcbnZhciBVU0VSX0RBVEFfU1RPUkFHRV9LRVkgPSBleHBvcnRzLlVTRVJfREFUQV9TVE9SQUdFX0tFWSA9ICdVU0VSX0RBVEFfU1RPUkFHRV9LRVknO1xuXG5mdW5jdGlvbiBzeW5jU2Vzc2lvblVzZXJUb1N0YXRlKCkge1xuICAgIHZhciBzZXNzaW9uVXNlciA9IGdldFVzZXJGcm9tU2Vzc2lvbigpO1xuICAgICgwLCBfaW5pdC5nZXRTdG9yZSkoKS5kaXNwYXRjaCgoMCwgX2F1dGhlbnRpY2F0aW9uQWN0aW9ucy5zYXZlVXNlclRvU3RhdGUpKHNlc3Npb25Vc2VyKSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVzZXJUb1Nlc3Npb24odXNlckRhdGEpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFVTRVJfREFUQV9TVE9SQUdFX0tFWSwgKDAsIF9zdHJpbmdpZnkyLmRlZmF1bHQpKHVzZXJEYXRhKSk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJGcm9tU2Vzc2lvbigpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFVTRVJfREFUQV9TVE9SQUdFX0tFWSkpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVVc2VyRnJvbVNlc3Npb24oKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShBVVRIX1RPS0VOX0hFQURFUik7XG59XG5cbmZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAoMCwgX2luaXQuZ2V0U3RvcmUpKCkuZGlzcGF0Y2goKDAsIF9hdXRoZW50aWNhdGlvbkFjdGlvbnMucmVtb3ZlVXNlckZyb21TdGF0ZSkoKSk7XG4gICAgcmVtb3ZlVXNlckZyb21TZXNzaW9uKCk7XG59XG5cbmZ1bmN0aW9uIHJlcXVpcmVBdXRoVXNlcihuZXh0U3RhdGUsIHJlcGxhY2UpIHtcbiAgICAvLyBsb29rIGZvciB0b2tlbiBpbiBzZXNzaW9uXG4gICAgdmFyIHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShBVVRIX1RPS0VOX0hFQURFUik7XG5cbiAgICAvLyB2ZXJpZnkgdG9rZW4gZXhpc3RzXG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgICBsb2dvdXQoKTtcbiAgICAgICAgcmVwbGFjZSh7XG4gICAgICAgICAgICBwYXRobmFtZTogJy9sb2dpbidcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB2ZXJpZnkgdG9rZW4gaGFzIG5vdCBleHBpcmVkXG4gICAgdmFyIGp3dERhdGEgPSAoMCwgX2p3dERlY29kZTIuZGVmYXVsdCkodG9rZW4pO1xuICAgIHZhciB0aW1lRGlmID0gand0RGF0YS5leHAgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBpZiAodGltZURpZiA8PSAwKSB7XG4gICAgICAgIGxvZ291dCgpO1xuICAgICAgICByZXBsYWNlKHtcbiAgICAgICAgICAgIHBhdGhuYW1lOiAnL2xvZ2luJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHZlcmlmeSB0b2tlbiBtYXRjaGVzIHVzZXJzXG4gICAgdmFyIGF1dGhVc2VyID0gZ2V0VXNlckZyb21TZXNzaW9uKCk7XG4gICAgaWYgKGp3dERhdGEudXNlcklkICE9PSBhdXRoVXNlci5pZCkge1xuICAgICAgICBsb2dvdXQoKTtcbiAgICAgICAgcmVwbGFjZSh7XG4gICAgICAgICAgICBwYXRobmFtZTogJy9sb2dpbidcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3luY1Nlc3Npb25Vc2VyVG9TdGF0ZSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbnZhciBfTWFpbk1lbnUgPSByZXF1aXJlKCcuLi9jb250YWluZXJzL2FkbWluUGFnZXMvY29tcG9uZW50cy9tYWluTWVudS9NYWluTWVudScpO1xuXG52YXIgX01haW5NZW51MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX01haW5NZW51KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEFkbWluVGVtcGxhdGUgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKEFkbWluVGVtcGxhdGUsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gQWRtaW5UZW1wbGF0ZShwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBBZG1pblRlbXBsYXRlKTtcbiAgICAgICAgcmV0dXJuICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKEFkbWluVGVtcGxhdGUuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEFkbWluVGVtcGxhdGUpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoQWRtaW5UZW1wbGF0ZSwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctYScgfSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfTWFpbk1lbnUyLmRlZmF1bHQsIG51bGwpLFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgeyBpZDogJ2ctYS1tYWluLWNvbnRhaW5lcicgfSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEFkbWluVGVtcGxhdGU7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5BZG1pblRlbXBsYXRlLnByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogX3JlYWN0LlByb3BUeXBlcy5ub2RlXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUsIG93blByb3BzKSB7XG4gICAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7fSkoQWRtaW5UZW1wbGF0ZSk7XG4iXX0=