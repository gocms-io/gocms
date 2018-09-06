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

function registeredReducers() {
    return (0, _extends3.default)({
        auth: _authenticationReducers2.default
    }, injectedReducers, {
        routing: _reactRouterRedux.routerReducer
    });
}

});

;require.register("gocms/admin/config/router/routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectAuthedRoutes = injectAuthedRoutes;
exports.registeredRoutes = registeredRoutes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _loginPage = require('../../containers/loginPage/loginPage.routes');

var _adminPages = require('../../containers/adminPages/adminPages.routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function injectAuthedRoutes(r) {
    (0, _adminPages.injectAdminRoutes)(r);
}

function registeredRoutes() {
    console.log("handing routes");
    return _react2.default.createElement(
        _reactRouter.Route,
        null,
        (0, _loginPage.registeredLoginRoutes)(),
        (0, _adminPages.registeredAdminRoutes)()
    );
}

});

;require.register("gocms/admin/config/sagas.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.rootSaga = rootSaga;
exports.injectSagas = injectSagas;

var _effects = require('redux-saga/effects');

var _loginPage = require('../containers/loginPage/loginPage.sagas');

var _loginPage2 = _interopRequireDefault(_loginPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(rootSaga);

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
    }, _marked, this);
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
    _react2.default.createElement(
        _reactRouter.Route,
        { path: 'admin', component: _admin_tmpl2.default, onEnter: _authentication.requireAuthUser },
        _dashboardPage2.default,
        injectedRoutes
    ),
    _react2.default.createElement(_reactRouter.Redirect, { from: '*', to: GOCMS_LOGIN_SUCCESS_REDIRECT })
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
                                GOCMS_LOGIN_TITLE
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
exports.registeredLoginRoutes = registeredLoginRoutes;
exports.injectLoginRoutes = injectLoginRoutes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _loginPage = require('./loginPage.container');

var _loginPage2 = _interopRequireDefault(_loginPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedRoutes = [];

var routes = _react2.default.createElement(
    _reactRouter.Route,
    null,
    injectedRoutes
);

function registeredLoginRoutes() {
    if (injectedRoutes.length != 0) {
        return routes;
    } else {
        return _react2.default.createElement(_reactRouter.Route, { path: 'login', component: _loginPage2.default });
    }
}

function injectLoginRoutes(r) {
    injectedRoutes.push(r);
}

});

;require.register("gocms/admin/containers/loginPage/loginPage.sagas.js", function(exports, require, module) {
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

var _marked = /*#__PURE__*/_regenerator2.default.mark(watchLoginSaga),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(handleLoginSaga),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(loginPageSagas);

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
    }, _marked, this);
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
    }, _marked2, this);
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
    }, _marked3, this);
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

var _routes = require('./config/router/routes');

var _reducers = require('./config/reducers/reducers');

var _loginPage = require('./containers/loginPage/loginPage.routes');

function getModule() {
    return {
        name: "goCMS Admin",
        sagas: _sagas.rootSaga,
        routes: (0, _routes.registeredRoutes)(),
        reducers: (0, _reducers.registeredReducers)()
    };
};

function injectModule(a) {
    (0, _sagas.injectSagas)(a.sagas);
    (0, _routes.injectAuthedRoutes)(a.routes);
    (0, _reducers.injectReducers)(a.reducers);

    // if not null inject custom login route
    if (a.loginRoutes != "" && a.loginRoutes != null && a.loginRoutes != [] && a.loginRoutes != {}) {
        (0, _loginPage.injectLoginRoutes)(a.loginRoutes);
    }
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

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluL2NvbXBvbmVudHMvYmFzaWNDb21wb25lbnQvQmFzaWNDb21wb25lbnQuanMiLCJhZG1pbi9jb25maWcvYWN0aW9ucy9hdXRoZW50aWNhdGlvbkFjdGlvbnMuanMiLCJhZG1pbi9jb25maWcvcmVkdWNlcnMvYXV0aGVudGljYXRpb25SZWR1Y2Vycy5qcyIsImFkbWluL2NvbmZpZy9yZWR1Y2Vycy9yZWR1Y2Vycy5qcyIsImFkbWluL2NvbmZpZy9yb3V0ZXIvcm91dGVzLmpzIiwiYWRtaW4vY29uZmlnL3NhZ2FzLmpzIiwiYWRtaW4vY29udGFpbmVycy9hZG1pblBhZ2VzL2FkbWluUGFnZXMucm91dGVzLmpzIiwiYWRtaW4vY29udGFpbmVycy9hZG1pblBhZ2VzL2NvbXBvbmVudHMvbWFpbk1lbnUvTWFpbk1lbnUuanMiLCJhZG1pbi9jb250YWluZXJzL2FkbWluUGFnZXMvZGFzaGJvYXJkUGFnZS9kYXNoYm9hcmRQYWdlLmFjdGlvbnMuanMiLCJhZG1pbi9jb250YWluZXJzL2FkbWluUGFnZXMvZGFzaGJvYXJkUGFnZS9kYXNoYm9hcmRQYWdlLmNvbnRhaW5lci5qcyIsImFkbWluL2NvbnRhaW5lcnMvYWRtaW5QYWdlcy9kYXNoYm9hcmRQYWdlL2Rhc2hib2FyZFBhZ2UucmVkdWNlcnMuanMiLCJhZG1pbi9jb250YWluZXJzL2FkbWluUGFnZXMvZGFzaGJvYXJkUGFnZS9kYXNoYm9hcmRQYWdlLnJlZHVjZXJzLnNlbGVjdG9ycy5qcyIsImFkbWluL2NvbnRhaW5lcnMvYWRtaW5QYWdlcy9kYXNoYm9hcmRQYWdlL2Rhc2hib2FyZFBhZ2Uucm91dGVzLmpzIiwiYWRtaW4vY29udGFpbmVycy9hZG1pblBhZ2VzL2Rhc2hib2FyZFBhZ2UvZGFzaGJvYXJkUGFnZS5zYWdhcy5qcyIsImFkbWluL2NvbnRhaW5lcnMvZGV2VG9vbHMvRGV2VG9vbHMuanMiLCJhZG1pbi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2UuYWN0aW9ucy5qcyIsImFkbWluL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5jb250YWluZXIuanMiLCJhZG1pbi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2UucmVkdWNlcnMuanMiLCJhZG1pbi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2UucmVkdWNlcnMuc2VsZWN0b3JzLmpzIiwiYWRtaW4vY29udGFpbmVycy9sb2dpblBhZ2UvbG9naW5QYWdlLnJvdXRlcy5qcyIsImFkbWluL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5zYWdhcy5qcyIsImFkbWluL2luaXQuanMiLCJhZG1pbi9zZXJ2aWNlcy9hdXRoZW50aWNhdGlvbi5qcyIsImFkbWluL3RlbXBsYXRlcy9hZG1pbl90bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbkVBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZCQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBM0NBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXRDQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWpDQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE1Q0E7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBL0NBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQS9JQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEzRUE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE3Q0E7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbERBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZCQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoQ0E7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWxDQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaEJBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF6S0E7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUE3Q0E7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbERBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdkNBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF6SEE7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbkNBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXpGQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNUVBO0FBQUEiLCJmaWxlIjoiLi4vYWRtaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEJhc2ljQ29tcG9uZW50ID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBCYXNpY0NvbXBvbmVudChwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBCYXNpY0NvbXBvbmVudCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoQmFzaWNDb21wb25lbnQuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEJhc2ljQ29tcG9uZW50KSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge307XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAncCcsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdiYXNpYy1jb21wb25lbnQnIH0sXG4gICAgICAgICAgICAgICAgJ0Jhc2ljIENvbXBvbmVudCdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEJhc2ljQ29tcG9uZW50O1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gICAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7fSkoQmFzaWNDb21wb25lbnQpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnNhdmVVc2VyVG9TdGF0ZSA9IHNhdmVVc2VyVG9TdGF0ZTtcbmV4cG9ydHMucmVtb3ZlVXNlckZyb21TdGF0ZSA9IHJlbW92ZVVzZXJGcm9tU3RhdGU7XG52YXIgU0FWRV9VU0VSX1RPX1NUQVRFID0gZXhwb3J0cy5TQVZFX1VTRVJfVE9fU1RBVEUgPSAnU0FWRV9VU0VSX1RPX1NUQVRFJztcbnZhciBSRU1PVkVfVVNFUl9GUk9NX1NUQVRFID0gZXhwb3J0cy5SRU1PVkVfVVNFUl9GUk9NX1NUQVRFID0gJ1JFTU9WRV9VU0VSX0ZST01fU1RBVEUnO1xuXG5mdW5jdGlvbiBzYXZlVXNlclRvU3RhdGUodXNlcikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFNBVkVfVVNFUl9UT19TVEFURSxcbiAgICAgICAgdXNlcjogdXNlcixcbiAgICAgICAgbG9nZ2VkSW5BdDogRGF0ZS5ub3coKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVVzZXJGcm9tU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogUkVNT1ZFX1VTRVJfRlJPTV9TVEFURVxuICAgIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9leHRlbmRzJyk7XG5cbnZhciBfZXh0ZW5kczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbmRzMik7XG5cbnZhciBfcmVkdXggPSByZXF1aXJlKCdyZWR1eCcpO1xuXG52YXIgX2F1dGhlbnRpY2F0aW9uQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvYXV0aGVudGljYXRpb25BY3Rpb25zJyk7XG5cbnZhciBhY3Rpb25zID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2F1dGhlbnRpY2F0aW9uQWN0aW9ucyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGF1dGhlbnRpY2F0aW9uUmVkdWNlcigpIHtcbiAgICB2YXIgc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgYWN0aW9ucy5TQVZFX1VTRVJfVE9fU1RBVEU6XG4gICAgICAgICAgICByZXR1cm4gKDAsIF9leHRlbmRzMy5kZWZhdWx0KSh7fSwgc3RhdGUsIGFjdGlvbi51c2VyLCB7XG4gICAgICAgICAgICAgICAgbG9nZ2VkSW5BdDogYWN0aW9uLmxvZ2dlZEluQXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIGFjdGlvbnMuUkVNT1ZFX1VTRVJfRlJPTV9TVEFURTpcbiAgICAgICAgICAgIHZhciBzID0gKDAsIF9leHRlbmRzMy5kZWZhdWx0KSh7fSwgc3RhdGUpO1xuICAgICAgICAgICAgZGVsZXRlIHNbJ3VzZXInXTtcbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cblxudmFyIGF1dGhlbnRpY2F0aW9uUmVkdWNlcnMgPSAoMCwgX3JlZHV4LmNvbWJpbmVSZWR1Y2Vycykoe1xuICAgIHVzZXI6IGF1dGhlbnRpY2F0aW9uUmVkdWNlclxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGF1dGhlbnRpY2F0aW9uUmVkdWNlcnM7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9leHRlbmRzJyk7XG5cbnZhciBfZXh0ZW5kczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbmRzMik7XG5cbnZhciBfYXNzaWduID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24nKTtcblxudmFyIF9hc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXNzaWduKTtcblxuZXhwb3J0cy5pbmplY3RSZWR1Y2VycyA9IGluamVjdFJlZHVjZXJzO1xuZXhwb3J0cy5yZWdpc3RlcmVkUmVkdWNlcnMgPSByZWdpc3RlcmVkUmVkdWNlcnM7XG5cbnZhciBfcmVhY3RSb3V0ZXJSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlci1yZWR1eCcpO1xuXG52YXIgX2F1dGhlbnRpY2F0aW9uUmVkdWNlcnMgPSByZXF1aXJlKCcuL2F1dGhlbnRpY2F0aW9uUmVkdWNlcnMnKTtcblxudmFyIF9hdXRoZW50aWNhdGlvblJlZHVjZXJzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2F1dGhlbnRpY2F0aW9uUmVkdWNlcnMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaW5qZWN0ZWRSZWR1Y2VycyA9IHt9O1xuXG5mdW5jdGlvbiBpbmplY3RSZWR1Y2VycyhyKSB7XG4gICAgaW5qZWN0ZWRSZWR1Y2VycyA9ICgwLCBfYXNzaWduMi5kZWZhdWx0KSh7fSwgciwgaW5qZWN0ZWRSZWR1Y2Vycyk7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyZWRSZWR1Y2VycygpIHtcbiAgICByZXR1cm4gKDAsIF9leHRlbmRzMy5kZWZhdWx0KSh7XG4gICAgICAgIGF1dGg6IF9hdXRoZW50aWNhdGlvblJlZHVjZXJzMi5kZWZhdWx0XG4gICAgfSwgaW5qZWN0ZWRSZWR1Y2Vycywge1xuICAgICAgICByb3V0aW5nOiBfcmVhY3RSb3V0ZXJSZWR1eC5yb3V0ZXJSZWR1Y2VyXG4gICAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaW5qZWN0QXV0aGVkUm91dGVzID0gaW5qZWN0QXV0aGVkUm91dGVzO1xuZXhwb3J0cy5yZWdpc3RlcmVkUm91dGVzID0gcmVnaXN0ZXJlZFJvdXRlcztcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0Um91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG5cbnZhciBfbG9naW5QYWdlID0gcmVxdWlyZSgnLi4vLi4vY29udGFpbmVycy9sb2dpblBhZ2UvbG9naW5QYWdlLnJvdXRlcycpO1xuXG52YXIgX2FkbWluUGFnZXMgPSByZXF1aXJlKCcuLi8uLi9jb250YWluZXJzL2FkbWluUGFnZXMvYWRtaW5QYWdlcy5yb3V0ZXMnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gaW5qZWN0QXV0aGVkUm91dGVzKHIpIHtcbiAgICAoMCwgX2FkbWluUGFnZXMuaW5qZWN0QWRtaW5Sb3V0ZXMpKHIpO1xufVxuXG5mdW5jdGlvbiByZWdpc3RlcmVkUm91dGVzKCkge1xuICAgIGNvbnNvbGUubG9nKFwiaGFuZGluZyByb3V0ZXNcIik7XG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBfcmVhY3RSb3V0ZXIuUm91dGUsXG4gICAgICAgIG51bGwsXG4gICAgICAgICgwLCBfbG9naW5QYWdlLnJlZ2lzdGVyZWRMb2dpblJvdXRlcykoKSxcbiAgICAgICAgKDAsIF9hZG1pblBhZ2VzLnJlZ2lzdGVyZWRBZG1pblJvdXRlcykoKVxuICAgICk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9yZWdlbmVyYXRvciA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3InKTtcblxudmFyIF9yZWdlbmVyYXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWdlbmVyYXRvcik7XG5cbmV4cG9ydHMucm9vdFNhZ2EgPSByb290U2FnYTtcbmV4cG9ydHMuaW5qZWN0U2FnYXMgPSBpbmplY3RTYWdhcztcblxudmFyIF9lZmZlY3RzID0gcmVxdWlyZSgncmVkdXgtc2FnYS9lZmZlY3RzJyk7XG5cbnZhciBfbG9naW5QYWdlID0gcmVxdWlyZSgnLi4vY29udGFpbmVycy9sb2dpblBhZ2UvbG9naW5QYWdlLnNhZ2FzJyk7XG5cbnZhciBfbG9naW5QYWdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZ2luUGFnZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBfbWFya2VkID0gLyojX19QVVJFX18qL19yZWdlbmVyYXRvcjIuZGVmYXVsdC5tYXJrKHJvb3RTYWdhKTtcblxudmFyIGluamVjdGVkU2FnYXMgPSBbXTtcblxuZnVuY3Rpb24gcm9vdFNhZ2EoKSB7XG4gICAgcmV0dXJuIF9yZWdlbmVyYXRvcjIuZGVmYXVsdC53cmFwKGZ1bmN0aW9uIHJvb3RTYWdhJChfY29udGV4dCkge1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbKDAsIF9lZmZlY3RzLmZvcmspKF9sb2dpblBhZ2UyLmRlZmF1bHQpXS5jb25jYXQoaW5qZWN0ZWRTYWdhcyk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIF9tYXJrZWQsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBpbmplY3RTYWdhcyhzKSB7XG4gICAgaW5qZWN0ZWRTYWdhcy5wdXNoKCgwLCBfZWZmZWN0cy5mb3JrKShzKSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaW5qZWN0QWRtaW5Sb3V0ZXMgPSBpbmplY3RBZG1pblJvdXRlcztcbmV4cG9ydHMucmVnaXN0ZXJlZEFkbWluUm91dGVzID0gcmVnaXN0ZXJlZEFkbWluUm91dGVzO1xuXG52YXIgX2F1dGhlbnRpY2F0aW9uID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvYXV0aGVudGljYXRpb24nKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX2Rhc2hib2FyZFBhZ2UgPSByZXF1aXJlKCcuL2Rhc2hib2FyZFBhZ2UvZGFzaGJvYXJkUGFnZS5yb3V0ZXMnKTtcblxudmFyIF9kYXNoYm9hcmRQYWdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rhc2hib2FyZFBhZ2UpO1xuXG52YXIgX2FkbWluX3RtcGwgPSByZXF1aXJlKCcuLi8uLi90ZW1wbGF0ZXMvYWRtaW5fdG1wbCcpO1xuXG52YXIgX2FkbWluX3RtcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYWRtaW5fdG1wbCk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGluamVjdGVkUm91dGVzID0gW107XG5cbnZhciByb3V0ZXMgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICBfcmVhY3RSb3V0ZXIuUm91dGUsXG4gICAgbnVsbCxcbiAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgX3JlYWN0Um91dGVyLlJvdXRlLFxuICAgICAgICB7IHBhdGg6ICdhZG1pbicsIGNvbXBvbmVudDogX2FkbWluX3RtcGwyLmRlZmF1bHQsIG9uRW50ZXI6IF9hdXRoZW50aWNhdGlvbi5yZXF1aXJlQXV0aFVzZXIgfSxcbiAgICAgICAgX2Rhc2hib2FyZFBhZ2UyLmRlZmF1bHQsXG4gICAgICAgIGluamVjdGVkUm91dGVzXG4gICAgKSxcbiAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3RSb3V0ZXIuUmVkaXJlY3QsIHsgZnJvbTogJyonLCB0bzogR09DTVNfTE9HSU5fU1VDQ0VTU19SRURJUkVDVCB9KVxuKTtcblxuZnVuY3Rpb24gaW5qZWN0QWRtaW5Sb3V0ZXMocikge1xuICAgIGluamVjdGVkUm91dGVzLnB1c2gocik7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyZWRBZG1pblJvdXRlcygpIHtcbiAgICByZXR1cm4gcm91dGVzO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbnZhciBfYXV0aGVudGljYXRpb24gPSByZXF1aXJlKCcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9hdXRoZW50aWNhdGlvbicpO1xuXG52YXIgX3JlYWN0Um91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBCYXNpY0NvbXBvbmVudCA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoQmFzaWNDb21wb25lbnQsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gQmFzaWNDb21wb25lbnQocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgQmFzaWNDb21wb25lbnQpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9ICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKEJhc2ljQ29tcG9uZW50Ll9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCkpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5oYW5kbGVNZW51T3BlbkNsb3NlQ2xpY2sgPSBfdGhpcy5oYW5kbGVNZW51T3BlbkNsb3NlQ2xpY2suYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLmhhbmRsZVNpZ25PdXQgPSBfdGhpcy5oYW5kbGVTaWduT3V0LmJpbmQoX3RoaXMpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgbWVudUlzT3BlbjogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoQmFzaWNDb21wb25lbnQsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhbmRsZVNpZ25PdXQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlU2lnbk91dChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAoMCwgX2F1dGhlbnRpY2F0aW9uLmxvZ291dCkoKTtcbiAgICAgICAgICAgIF9yZWFjdFJvdXRlci5icm93c2VySGlzdG9yeS5wdXNoKFwiL2xvZ2luXCIpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdoYW5kbGVNZW51T3BlbkNsb3NlQ2xpY2snLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlTWVudU9wZW5DbG9zZUNsaWNrKGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBtZW51SXNPcGVuOiAhdGhpcy5zdGF0ZS5tZW51SXNPcGVuIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ1c2VyOiBcIiwgdGhpcy5zdGF0ZS51c2VyKTtcbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImctY29udGFpbmVyIGctYS1tYWluLW1lbnUtY29udGFpbmVyXCIgKyAodGhpcy5zdGF0ZS5tZW51SXNPcGVuID8gXCIgZy1hLW1haW4tbWVudS1jb250YWluZXItb3BlblwiIDogXCIgZy1hLW1haW4tbWVudS1jb250YWluZXItY2xvc2VcIikgfSxcbiAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZy1jb250YWluZXIgZy1hLW1haW4tbWVudS10aXRsZS1jb250YWluZXJcIiArICh0aGlzLnN0YXRlLm1lbnVJc09wZW4gPyBcIiBnLWEtbWFpbi1tZW51LXRpdGxlLWNvbnRhaW5lci1vcGVuXCIgOiBcIiBnLWEtbWFpbi1tZW51LXRpdGxlLWNvbnRhaW5lci1jbG9zZVwiKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWEtbWFpbi1tZW51LXByb2ZpbGUtaW1nLWNvbnRhaW5lcicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGhyZWY6ICcnLCBjbGFzc05hbWU6ICdnLWEtbWFpbi1tZW51LXByb2ZpbGUtaW1nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnaScsIHsgY2xhc3NOYW1lOiAnZ29jbXMtaWNvbi11c2VyJyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctY29udGFpbmVyLWNvbCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2gxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWEtbWFpbi1tZW51LXRpdGxlJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHT0NNU19MT0dJTl9USVRMRVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZy1hLW1haW4tbWVudS1zdWItdGl0bGUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICcnLCBocmVmOiAnJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy51c2VyLmZ1bGxOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWEtbWFpbi1tZW51LXNpZ24tb3V0JyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJycsIG9uQ2xpY2s6IHRoaXMuaGFuZGxlU2lnbk91dCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdTaWduIE91dCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZy1hLW1haW4tbWVudS1idG5cIiArICh0aGlzLnN0YXRlLm1lbnVJc09wZW4gPyBcIiBnLWEtbWFpbi1tZW51LWJ0bi1vcGVuXCIgOiBcIiBnLWEtbWFpbi1tZW51LWJ0bi1jbG9zZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuaGFuZGxlTWVudU9wZW5DbG9zZUNsaWNrIH0sXG4gICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdnb2Ntcy1pY29uLW1lbnUnIH0pXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gQmFzaWNDb21wb25lbnQ7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB1c2VyOiBzdGF0ZS5hdXRoLnVzZXJcbiAgICB9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7fSkoQmFzaWNDb21wb25lbnQpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAgPSByZXF1aXJlKCdyZWFjdC10cmFuc2l0aW9uLWdyb3VwL0NTU1RyYW5zaXRpb25Hcm91cCcpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9DU1NUcmFuc2l0aW9uR3JvdXApO1xuXG52YXIgX3JlYWN0UmVkdXggPSByZXF1aXJlKCdyZWFjdC1yZWR1eCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgRGFzaGJvYXJkUGFnZSA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoRGFzaGJvYXJkUGFnZSwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBEYXNoYm9hcmRQYWdlKHByb3BzKSB7XG4gICAgICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szLmRlZmF1bHQpKHRoaXMsIERhc2hib2FyZFBhZ2UpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9ICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKERhc2hib2FyZFBhZ2UuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKERhc2hib2FyZFBhZ2UpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7fTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKERhc2hib2FyZFBhZ2UsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblxuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdoMScsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAnZGFzaGJvYXJkJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gRGFzaGJvYXJkUGFnZTtcbn0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuICAgIHJldHVybiB7fTtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9yZWFjdFJlZHV4LmNvbm5lY3QpKG1hcFN0YXRlVG9Qcm9wcywge30pKERhc2hib2FyZFBhZ2UpO1xuIiwiLy8gaW1wb3J0IHtjb21iaW5lUmVkdWNlcnN9IGZyb20gJ3JlZHV4J1xuLy8gaW1wb3J0IHtSRVFVRVNUX1BBR0UsIFJFQ0VJVkVfUEFHRX0gZnJvbSAnLi9ob21lLmFjdGlvbnMnO1xuLy9cbi8vXG4vLyBjb25zdCBpbml0aWFsU3RhdGUgPSB7fTtcbi8vXG4vLyBmdW5jdGlvbiBwYWdlKHN0YXRlID0ge1xuLy8gICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuLy8gICAgIGl0ZW1zOiBbXVxuLy8gfSwgYWN0aW9uKSB7XG4vLyAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuLy8gICAgICAgICBjYXNlIFJFUVVFU1RfUEFHRTpcbi8vICAgICAgICAgICAgIHJldHVybiB7Li4uc3RhdGUsIGlzRmV0Y2hpbmc6IHRydWV9O1xuLy9cbi8vICAgICAgICAgY2FzZSBSRUNFSVZFX1BBR0U6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGFjdGlvbi5jb250ZW50LFxuLy8gICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVkOiBhY3Rpb24ucmVjZWl2ZWRBdFxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgZGVmYXVsdDpcbi8vICAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuLy8gICAgIH1cbi8vIH1cbi8vXG4vLyBmdW5jdGlvbiBwYWdlQnlVcmkoc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xuLy8gICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbi8vICAgICAgICAgY2FzZSBSRVFVRVNUX1BBR0U6XG4vLyAgICAgICAgIGNhc2UgUkVDRUlWRV9QQUdFOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBbYWN0aW9uLnVyaV06IHBhZ2Uoc3RhdGVbYWN0aW9uLnVyaV0sIGFjdGlvbilcbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGRlZmF1bHQ6XG4vLyAgICAgICAgICAgICByZXR1cm4gc3RhdGVcbi8vICAgICB9XG4vLyB9XG4vL1xuLy8gY29uc3Qgcm9vdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuLy8gICAgIHBhZ2VCeVVyaSxcbi8vIH0pO1xuLy9cbi8vIGV4cG9ydCBkZWZhdWx0IHJvb3RSZWR1Y2VyXG5cInVzZSBzdHJpY3RcIjtcbiIsIi8vIGltcG9ydCB7Y29tYmluZVJlZHVjZXJzfSBmcm9tICdyZWR1eCdcbi8vIGltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi4vLi4vY29uZmlnL2FjdGlvbnMvZm9ybSc7XG4vL1xuLy8gZnVuY3Rpb24gX2Zvcm1SZXF1ZXN0UmVkdWNlcihzdGF0ZSA9IHt9LCBhY3Rpb24pIHtcbi8vICAgICBsZXQga2V5ID0gYWN0aW9uLmtleTtcbi8vICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4vLyAgICAgICAgIGNhc2UgYWN0aW9ucy5SRVFVRVNUOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBba2V5XToge1xuLy8gICAgICAgICAgICAgICAgICAgICAuLi5zdGF0ZVtrZXldLFxuLy8gICAgICAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4vLyAgICAgICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RlZEF0OiBhY3Rpb24ucmVxdWVzdGVkQXRcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBjYXNlIGFjdGlvbnMuU1VDQ0VTUzpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgW2tleV06IHtcbi8vICAgICAgICAgICAgICAgICAgICAgLi4uc3RhdGVba2V5XSxcbi8vICAgICAgICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuLy8gICAgICAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZWRBdDogYWN0aW9uLnJlY2VpdmVkQXQsXG4vLyAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGFjdGlvbi5kYXRhXG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgY2FzZSBhY3Rpb25zLkZBSUxVUkU6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIFtrZXldOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIC4uLnN0YXRlW2tleV0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGtleTogYWN0aW9uLmtleSxcbi8vICAgICAgICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVkQXQ6IGFjdGlvbi5yZWNlaXZlZEF0LFxuLy8gICAgICAgICAgICAgICAgICAgICBlcnI6IGFjdGlvbi5lcnJcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBkZWZhdWx0OlxuLy8gICAgICAgICAgICAgcmV0dXJuIHN0YXRlXG4vLyAgICAgfVxuLy8gfVxuLy9cbi8vXG4vLyBjb25zdCBmb3JtUmVxdWVzdFJlZHVjZXIgPSBjb21iaW5lUmVkdWNlcnMoe1xuLy8gICAgIF9mb3JtUmVxdWVzdFJlZHVjZXIsXG4vLyB9KTtcbi8vXG4vLyBleHBvcnQgZGVmYXVsdCBmb3JtUmVxdWVzdFJlZHVjZXJcblwidXNlIHN0cmljdFwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xuXG52YXIgX2Rhc2hib2FyZFBhZ2UgPSByZXF1aXJlKCcuL2Rhc2hib2FyZFBhZ2UuY29udGFpbmVyJyk7XG5cbnZhciBfZGFzaGJvYXJkUGFnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kYXNoYm9hcmRQYWdlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgX3JlYWN0Um91dGVyLlJvdXRlLFxuICAgIG51bGwsXG4gICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0Um91dGVyLlJvdXRlLCB7IHBhdGg6ICdkYXNoYm9hcmQnLCBjb21wb25lbnQ6IF9kYXNoYm9hcmRQYWdlMi5kZWZhdWx0IH0pXG4pO1xuIiwiLy8gaW1wb3J0IHtmb3JrLCB0YWtlRXZlcnksIHB1dCwgY2FsbH0gZnJvbSAncmVkdXgtc2FnYS9lZmZlY3RzJztcbi8vIGltcG9ydCAqIGFzIGFwaUFjdGlvbnMgZnJvbSAnLi4vLi4vLi4vYmFzZS9hY3Rpb25zL2FwaVJlcXVlc3RBY3Rpb25zJzsgLy8gaW1wb3J0aW5nIG91ciBhY3Rpb25cbi8vIGltcG9ydCB7bG9naW59IGZyb20gJy4uLy4uL2NvbmZpZy9hY3Rpb25zL2F1dGhlbnRpY2F0aW9uQWN0aW9ucydcbi8vIGltcG9ydCB7UG9zdCwgRU5EUE9JTlRTfSBmcm9tICcuLi8uLi8uLi9iYXNlL3NlcnZpY2VzL2FwaSc7XG4vLyBpbXBvcnQgeyBicm93c2VySGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlcidcbi8vXG4vL1xuLy8gLy8gd2F0Y2ggZm9yIGxvZ2luIHJlcXVlc3RzXG4vLyBmdW5jdGlvbiogd2F0Y2hMb2dpblNhZ2EoKSB7XG4vLyAgICAgeWllbGQgdGFrZUV2ZXJ5KGFwaUFjdGlvbnMuUkVRVUVTVCwgaGFuZGxlTG9naW5TYWdhKTsgLy8gc2VlIGRldGFpbHMgd2hhdCBpcyBSRVFVRVNUIHBhcmFtIGJlbG93XG4vLyB9XG4vL1xuLy8gZnVuY3Rpb24qIGhhbmRsZUxvZ2luU2FnYShhY3Rpb24pIHtcbi8vICAgICBsZXQge3JlcywgZXJyfSA9IHlpZWxkIGNhbGwoUG9zdCwgRU5EUE9JTlRTLmxvZ2luLCBhY3Rpb24uZGF0YSk7IC8vIGNhbGxpbmcgb3VyIGFwaSBtZXRob2Rcbi8vICAgICBpZiAocmVzKSB7XG4vLyAgICAgICAgIC8vIHB1c2ggdXNlciBpbmZvIHRvIHN0b3JlXG4vLyAgICAgICAgIHlpZWxkIHB1dChsb2dpbihyZXMuanNvbikpO1xuLy8gICAgICAgICB5aWVsZCBwdXQoYXBpQWN0aW9ucy5wdXJnZShhY3Rpb24ua2V5KSk7XG4vLyAgICAgICAgIGJyb3dzZXJIaXN0b3J5LnB1c2goR09DTVNfTE9HSU5fU1VDQ0VTU19SRURJUkVDVCk7XG4vLyAgICAgfVxuLy8gICAgIGVsc2UgaWYgKGVycikge1xuLy8gICAgICAgICAvLyBmZXRjaCBwYWdlIGRhdGEgYmFzZWQgb24gdXJpXG4vLyAgICAgICAgIHlpZWxkIHB1dChhcGlBY3Rpb25zLmZhaWx1cmUoYWN0aW9uLmtleSwgZXJyKSk7XG4vLyAgICAgfVxuLy8gfVxuLy9cbi8vIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKiBsb2dpblBhZ2VTYWdhcygpIHtcbi8vICAgICB5aWVsZCBbXG4vLyAgICAgICAgIGZvcmsod2F0Y2hMb2dpblNhZ2EpLFxuLy8gICAgIF07XG4vLyB9XG5cInVzZSBzdHJpY3RcIjtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVkdXhEZXZ0b29scyA9IHJlcXVpcmUoJ3JlZHV4LWRldnRvb2xzJyk7XG5cbnZhciBfcmVkdXhEZXZ0b29sc0xvZ01vbml0b3IgPSByZXF1aXJlKCdyZWR1eC1kZXZ0b29scy1sb2ctbW9uaXRvcicpO1xuXG52YXIgX3JlZHV4RGV2dG9vbHNMb2dNb25pdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4RGV2dG9vbHNMb2dNb25pdG9yKTtcblxudmFyIF9yZWR1eERldnRvb2xzRG9ja01vbml0b3IgPSByZXF1aXJlKCdyZWR1eC1kZXZ0b29scy1kb2NrLW1vbml0b3InKTtcblxudmFyIF9yZWR1eERldnRvb2xzRG9ja01vbml0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVkdXhEZXZ0b29sc0RvY2tNb25pdG9yKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLy8gRE9DUzogaHR0cHM6Ly9naXRodWIuY29tL2dhZWFyb24vcmVkdXgtZGV2dG9vbHNcblxuLy8gY3JlYXRlRGV2VG9vbHMgdGFrZXMgYSBtb25pdG9yIGFuZCBwcm9kdWNlcyBhIERldlRvb2xzIGNvbXBvbmVudFxudmFyIERldlRvb2xzID0gKDAsIF9yZWR1eERldnRvb2xzLmNyZWF0ZURldlRvb2xzKShfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICBfcmVkdXhEZXZ0b29sc0RvY2tNb25pdG9yMi5kZWZhdWx0LFxuICAgIHsgdG9nZ2xlVmlzaWJpbGl0eUtleTogJ2N0cmwtaCcsXG4gICAgICAgIGNoYW5nZVBvc2l0aW9uS2V5OiAnY3RybC1xJyxcbiAgICAgICAgZGVmYXVsdFBvc2l0aW9uOiAnbGVmdCcgfSxcbiAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVkdXhEZXZ0b29sc0xvZ01vbml0b3IyLmRlZmF1bHQsIHsgdGhlbWU6ICd0b21vcnJvdycgfSlcbikpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBEZXZUb29scztcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5nb2Ntc19sb2dpbiA9IGdvY21zX2xvZ2luO1xudmFyIEdPQ01TX0xPR0lOID0gZXhwb3J0cy5HT0NNU19MT0dJTiA9ICdHT0NNU19MT0dJTic7XG5cbmZ1bmN0aW9uIGdvY21zX2xvZ2luKGtleSwgZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IEdPQ01TX0xPR0lOLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgcmVxdWVzdGVkQXQ6IERhdGUubm93KClcbiAgICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZSgncmVhY3QtdHJhbnNpdGlvbi1ncm91cC9DU1NUcmFuc2l0aW9uR3JvdXAnKTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ1NTVHJhbnNpdGlvbkdyb3VwKTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxudmFyIF9sb2dpblBhZ2UgPSByZXF1aXJlKCcuL2xvZ2luUGFnZS5hY3Rpb25zJyk7XG5cbnZhciBfR0Zvcm0gPSByZXF1aXJlKCcuLi8uLi8uLi9iYXNlL2NvbXBvbmVudHMvZ0Zvcm0vR0Zvcm0nKTtcblxudmFyIF9HRm9ybTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9HRm9ybSk7XG5cbnZhciBfR0lucHV0ID0gcmVxdWlyZSgnLi4vLi4vLi4vYmFzZS9jb21wb25lbnRzL2dGb3JtL0dJbnB1dCcpO1xuXG52YXIgX0dJbnB1dDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9HSW5wdXQpO1xuXG52YXIgX0dFcnJvciA9IHJlcXVpcmUoJy4uLy4uLy4uL2Jhc2UvY29tcG9uZW50cy9nRm9ybS9HRXJyb3InKTtcblxudmFyIF9HRXJyb3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfR0Vycm9yKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIExPR0lOX0ZPUk0gPSBcIkdPQ01TX0xPR0lOX0ZPUk1cIjtcblxudmFyIExvZ2luUGFnZSA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoTG9naW5QYWdlLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIExvZ2luUGFnZShwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBMb2dpblBhZ2UpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9ICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKExvZ2luUGFnZS5fX3Byb3RvX18gfHwgKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoTG9naW5QYWdlKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgc2hha2U6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIF90aGlzLmhhbmRsZVN1Ym1pdCA9IF90aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKF90aGlzKTsgLy9iaW5kIGZ1bmN0aW9uIG9uY2VcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKExvZ2luUGFnZSwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHt9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHt9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgICAgICBpZiAoISFuZXh0UHJvcHMuZXJyICYmIG5leHRQcm9wcy5yZXFUaW1lICE9IHRoaXMucHJvcHMucmVxVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaGFrZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghIW5leHRQcm9wcy5lcnJNZXNzYWdlICYmIG5leHRQcm9wcy5lcnJNZXNzYWdlICE9IHRoaXMuc3RhdGUuZXJyTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJNZXNzYWdlOiBuZXh0UHJvcHMuZXJyTWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGFuZGxlU3VibWl0JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChtb2RlbCkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5nb2Ntc19sb2dpbihMT0dJTl9GT1JNLCBtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZXJyTWVzc2FnZTogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblxuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZy1hJyB9LFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgeyBpZDogJ2NvbnRhaW5lci1sb2dpbi1wYWdlJyB9LFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpZDogJ2NvbnRhaW5lci1sb2dpbi1wYWdlLWZvcm0nLCBjbGFzc05hbWU6ICdnLWNvbnRhaW5lci1jb2wnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3dyYXBwZXItbG9naW4tZm9ybScsIG5vVmFsaWRhdGU6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZy1jb250YWluZXItY29sJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdoMScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ3RleHQtY2VudGVyIG5vLXBhZGRpbmcgbm8tbWFyZ2luJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgR09DTVNfTE9HSU5fVElUTEVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfR0Zvcm0yLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGlkOiAnbWFpbi1sb2dpbi1mb3JtJywgY2xhc3NOYW1lOiAnbWFpbi1sb2dpbi1mb3JtJywgbmFtZTogJ21haW4tbG9naW4tZm9ybScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TdWJtaXQ6IHRoaXMuaGFuZGxlU3VibWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ0bjogJ0xvZyBJbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VibWl0QnRuQ2xhc3NOYW1lOiBcImJ0bi1kZWZhdWx0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VibWl0QnRuU2hha2U6IHRoaXMuc3RhdGUuc2hha2UgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9HSW5wdXQyLmRlZmF1bHQsIHsgaWQ6ICdlbWFpbCcsIG5hbWU6ICdlbWFpbCcsIHR5cGU6ICd0ZXh0JywgbGFiZWw6ICdFbWFpbCcsIHZhbGlkYXRpb25zOiAnaXNFbWFpbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbkVycm9yOiAnUGxlYXNlIGVudGVyIGEgdmFsaWQgZW1haWwuJywgcmVxdWlyZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfR0lucHV0Mi5kZWZhdWx0LCB7IGlkOiAncGFzc3dvcmQnLCBuYW1lOiAncGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnLCBsYWJlbDogJ1Bhc3N3b3JkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWNvbCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9HRXJyb3IyLmRlZmF1bHQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdlcnJvci1tZXNzYWdlLWxvZ2luJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJNZXNzYWdlOiB0aGlzLnN0YXRlLmVyck1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBMb2dpblBhZ2U7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcbiAgICB2YXIgZXJyTWVzc2FnZSA9IHZvaWQgMDtcbiAgICB2YXIgZXJyID0gdm9pZCAwO1xuICAgIHZhciByZXFUaW1lID0gdm9pZCAwO1xuICAgIHZhciByZXEgPSBzdGF0ZS5hcGkucmVxdWVzdFtMT0dJTl9GT1JNXTtcbiAgICBpZiAoISFyZXEpIHtcbiAgICAgICAgcmVxVGltZSA9IHJlcS5yZWNlaXZlZEF0O1xuICAgICAgICBpZiAoISFyZXEuZXJyKSB7XG4gICAgICAgICAgICBlcnIgPSByZXEuZXJyO1xuICAgICAgICAgICAgaWYgKCEhZXJyLmpzb24gJiYgISFlcnIuanNvbi5tZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgZXJyTWVzc2FnZSA9IGVyci5qc29uLm1lc3NhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVxVGltZTogcmVxVGltZSxcbiAgICAgICAgZXJyOiBlcnIsXG4gICAgICAgIGVyck1lc3NhZ2U6IGVyck1lc3NhZ2VcbiAgICB9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7XG4gICAgZ29jbXNfbG9naW46IF9sb2dpblBhZ2UuZ29jbXNfbG9naW5cbn0pKExvZ2luUGFnZSk7XG4iLCIvLyBpbXBvcnQge2NvbWJpbmVSZWR1Y2Vyc30gZnJvbSAncmVkdXgnXG4vLyBpbXBvcnQge1JFUVVFU1RfUEFHRSwgUkVDRUlWRV9QQUdFfSBmcm9tICcuL2hvbWUuYWN0aW9ucyc7XG4vL1xuLy9cbi8vIGNvbnN0IGluaXRpYWxTdGF0ZSA9IHt9O1xuLy9cbi8vIGZ1bmN0aW9uIHBhZ2Uoc3RhdGUgPSB7XG4vLyAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4vLyAgICAgaXRlbXM6IFtdXG4vLyB9LCBhY3Rpb24pIHtcbi8vICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4vLyAgICAgICAgIGNhc2UgUkVRVUVTVF9QQUdFOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgaXNGZXRjaGluZzogdHJ1ZX07XG4vL1xuLy8gICAgICAgICBjYXNlIFJFQ0VJVkVfUEFHRTpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgY29udGVudDogYWN0aW9uLmNvbnRlbnQsXG4vLyAgICAgICAgICAgICAgICAgbGFzdFVwZGF0ZWQ6IGFjdGlvbi5yZWNlaXZlZEF0XG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBkZWZhdWx0OlxuLy8gICAgICAgICAgICAgcmV0dXJuIHN0YXRlXG4vLyAgICAgfVxuLy8gfVxuLy9cbi8vIGZ1bmN0aW9uIHBhZ2VCeVVyaShzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG4vLyAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuLy8gICAgICAgICBjYXNlIFJFUVVFU1RfUEFHRTpcbi8vICAgICAgICAgY2FzZSBSRUNFSVZFX1BBR0U6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIFthY3Rpb24udXJpXTogcGFnZShzdGF0ZVthY3Rpb24udXJpXSwgYWN0aW9uKVxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgZGVmYXVsdDpcbi8vICAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuLy8gICAgIH1cbi8vIH1cbi8vXG4vLyBjb25zdCByb290UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4vLyAgICAgcGFnZUJ5VXJpLFxuLy8gfSk7XG4vL1xuLy8gZXhwb3J0IGRlZmF1bHQgcm9vdFJlZHVjZXJcblwidXNlIHN0cmljdFwiO1xuIiwiLy8gaW1wb3J0IHtjb21iaW5lUmVkdWNlcnN9IGZyb20gJ3JlZHV4J1xuLy8gaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuLi8uLi9jb25maWcvYWN0aW9ucy9mb3JtJztcbi8vXG4vLyBmdW5jdGlvbiBfZm9ybVJlcXVlc3RSZWR1Y2VyKHN0YXRlID0ge30sIGFjdGlvbikge1xuLy8gICAgIGxldCBrZXkgPSBhY3Rpb24ua2V5O1xuLy8gICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbi8vICAgICAgICAgY2FzZSBhY3Rpb25zLlJFUVVFU1Q6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIFtrZXldOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIC4uLnN0YXRlW2tleV0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGtleTogYWN0aW9uLmtleSxcbi8vICAgICAgICAgICAgICAgICAgICAgaXNGZXRjaGluZzogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdGVkQXQ6IGFjdGlvbi5yZXF1ZXN0ZWRBdFxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGNhc2UgYWN0aW9ucy5TVUNDRVNTOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBba2V5XToge1xuLy8gICAgICAgICAgICAgICAgICAgICAuLi5zdGF0ZVtrZXldLFxuLy8gICAgICAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4vLyAgICAgICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICByZWNlaXZlZEF0OiBhY3Rpb24ucmVjZWl2ZWRBdCxcbi8vICAgICAgICAgICAgICAgICAgICAgZGF0YTogYWN0aW9uLmRhdGFcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBjYXNlIGFjdGlvbnMuRkFJTFVSRTpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgW2tleV06IHtcbi8vICAgICAgICAgICAgICAgICAgICAgLi4uc3RhdGVba2V5XSxcbi8vICAgICAgICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuLy8gICAgICAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZWRBdDogYWN0aW9uLnJlY2VpdmVkQXQsXG4vLyAgICAgICAgICAgICAgICAgICAgIGVycjogYWN0aW9uLmVyclxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGRlZmF1bHQ6XG4vLyAgICAgICAgICAgICByZXR1cm4gc3RhdGVcbi8vICAgICB9XG4vLyB9XG4vL1xuLy9cbi8vIGNvbnN0IGZvcm1SZXF1ZXN0UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4vLyAgICAgX2Zvcm1SZXF1ZXN0UmVkdWNlcixcbi8vIH0pO1xuLy9cbi8vIGV4cG9ydCBkZWZhdWx0IGZvcm1SZXF1ZXN0UmVkdWNlclxuXCJ1c2Ugc3RyaWN0XCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucmVnaXN0ZXJlZExvZ2luUm91dGVzID0gcmVnaXN0ZXJlZExvZ2luUm91dGVzO1xuZXhwb3J0cy5pbmplY3RMb2dpblJvdXRlcyA9IGluamVjdExvZ2luUm91dGVzO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxudmFyIF9sb2dpblBhZ2UgPSByZXF1aXJlKCcuL2xvZ2luUGFnZS5jb250YWluZXInKTtcblxudmFyIF9sb2dpblBhZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9naW5QYWdlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGluamVjdGVkUm91dGVzID0gW107XG5cbnZhciByb3V0ZXMgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICBfcmVhY3RSb3V0ZXIuUm91dGUsXG4gICAgbnVsbCxcbiAgICBpbmplY3RlZFJvdXRlc1xuKTtcblxuZnVuY3Rpb24gcmVnaXN0ZXJlZExvZ2luUm91dGVzKCkge1xuICAgIGlmIChpbmplY3RlZFJvdXRlcy5sZW5ndGggIT0gMCkge1xuICAgICAgICByZXR1cm4gcm91dGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3RSb3V0ZXIuUm91dGUsIHsgcGF0aDogJ2xvZ2luJywgY29tcG9uZW50OiBfbG9naW5QYWdlMi5kZWZhdWx0IH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5qZWN0TG9naW5Sb3V0ZXMocikge1xuICAgIGluamVjdGVkUm91dGVzLnB1c2gocik7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9yZWdlbmVyYXRvciA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3InKTtcblxudmFyIF9yZWdlbmVyYXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWdlbmVyYXRvcik7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGxvZ2luUGFnZVNhZ2FzO1xuXG52YXIgX2VmZmVjdHMgPSByZXF1aXJlKCdyZWR1eC1zYWdhL2VmZmVjdHMnKTtcblxudmFyIF9sb2dpblBhZ2UgPSByZXF1aXJlKCcuL2xvZ2luUGFnZS5hY3Rpb25zJyk7XG5cbnZhciBsb2dpbkFjdGlvbnMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfbG9naW5QYWdlKTtcblxudmFyIF9hcGlSZXF1ZXN0QWN0aW9ucyA9IHJlcXVpcmUoJy4uLy4uLy4uL2Jhc2UvYWN0aW9ucy9hcGlSZXF1ZXN0QWN0aW9ucycpO1xuXG52YXIgYXBpQWN0aW9ucyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9hcGlSZXF1ZXN0QWN0aW9ucyk7XG5cbnZhciBfYXBpID0gcmVxdWlyZSgnLi4vLi4vLi4vYmFzZS9zZXJ2aWNlcy9hcGknKTtcblxudmFyIF9hdXRoZW50aWNhdGlvbiA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2VzL2F1dGhlbnRpY2F0aW9uJyk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7IGlmIChvYmogJiYgb2JqLl9fZXNNb2R1bGUpIHsgcmV0dXJuIG9iajsgfSBlbHNlIHsgdmFyIG5ld09iaiA9IHt9OyBpZiAob2JqICE9IG51bGwpIHsgZm9yICh2YXIga2V5IGluIG9iaikgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIF9tYXJrZWQgPSAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yMi5kZWZhdWx0Lm1hcmsod2F0Y2hMb2dpblNhZ2EpLFxuICAgIF9tYXJrZWQyID0gLyojX19QVVJFX18qL19yZWdlbmVyYXRvcjIuZGVmYXVsdC5tYXJrKGhhbmRsZUxvZ2luU2FnYSksXG4gICAgX21hcmtlZDMgPSAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yMi5kZWZhdWx0Lm1hcmsobG9naW5QYWdlU2FnYXMpO1xuXG4vLyB3YXRjaCBmb3IgbG9naW4gcmVxdWVzdHNcbmZ1bmN0aW9uIHdhdGNoTG9naW5TYWdhKCkge1xuICAgIHJldHVybiBfcmVnZW5lcmF0b3IyLmRlZmF1bHQud3JhcChmdW5jdGlvbiB3YXRjaExvZ2luU2FnYSQoX2NvbnRleHQpIHtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQucHJldiA9IF9jb250ZXh0Lm5leHQpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAyO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnRha2VFdmVyeSkobG9naW5BY3Rpb25zLkdPQ01TX0xPR0lOLCBoYW5kbGVMb2dpblNhZ2EpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dC5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBfbWFya2VkLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlTG9naW5TYWdhKGFjdGlvbikge1xuICAgIHZhciBfcmVmLCByZXMsIGVycjtcblxuICAgIHJldHVybiBfcmVnZW5lcmF0b3IyLmRlZmF1bHQud3JhcChmdW5jdGlvbiBoYW5kbGVMb2dpblNhZ2EkKF9jb250ZXh0Mikge1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDIucHJldiA9IF9jb250ZXh0Mi5uZXh0KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuY2FsbCkoX2FwaS5Qb3N0LCBfYXBpLkVORFBPSU5UUy5sb2dpbiwgYWN0aW9uLmRhdGEpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBfcmVmID0gX2NvbnRleHQyLnNlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IF9yZWYucmVzO1xuICAgICAgICAgICAgICAgICAgICBlcnIgPSBfcmVmLmVycjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSA4O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLmNhbGwpKF9hdXRoZW50aWNhdGlvbi5hZGRVc2VyVG9TZXNzaW9uLCByZXMuanNvbik7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTA7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuY2FsbCkoX2F1dGhlbnRpY2F0aW9uLnN5bmNTZXNzaW9uVXNlclRvU3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxMjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKGFwaUFjdGlvbnMucHVyZ2UoYWN0aW9uLmtleSkpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICAgICAgX3JlYWN0Um91dGVyLmJyb3dzZXJIaXN0b3J5LnB1c2goR09DTVNfTE9HSU5fU1VDQ0VTU19SRURJUkVDVCk7XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTg7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMTg7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMucHV0KShhcGlBY3Rpb25zLmZhaWx1cmUoYWN0aW9uLmtleSwgZXJyKSk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE4OlxuICAgICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dDIuc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgX21hcmtlZDIsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBsb2dpblBhZ2VTYWdhcygpIHtcbiAgICByZXR1cm4gX3JlZ2VuZXJhdG9yMi5kZWZhdWx0LndyYXAoZnVuY3Rpb24gbG9naW5QYWdlU2FnYXMkKF9jb250ZXh0Mykge1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dDMucHJldiA9IF9jb250ZXh0My5uZXh0KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBfY29udGV4dDMubmV4dCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbKDAsIF9lZmZlY3RzLmZvcmspKHdhdGNoTG9naW5TYWdhKV07XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0My5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBfbWFya2VkMywgdGhpcyk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZ2V0TW9kdWxlID0gZ2V0TW9kdWxlO1xuZXhwb3J0cy5pbmplY3RNb2R1bGUgPSBpbmplY3RNb2R1bGU7XG5cbnZhciBfc2FnYXMgPSByZXF1aXJlKCcuL2NvbmZpZy9zYWdhcycpO1xuXG52YXIgX3JvdXRlcyA9IHJlcXVpcmUoJy4vY29uZmlnL3JvdXRlci9yb3V0ZXMnKTtcblxudmFyIF9yZWR1Y2VycyA9IHJlcXVpcmUoJy4vY29uZmlnL3JlZHVjZXJzL3JlZHVjZXJzJyk7XG5cbnZhciBfbG9naW5QYWdlID0gcmVxdWlyZSgnLi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2Uucm91dGVzJyk7XG5cbmZ1bmN0aW9uIGdldE1vZHVsZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBcImdvQ01TIEFkbWluXCIsXG4gICAgICAgIHNhZ2FzOiBfc2FnYXMucm9vdFNhZ2EsXG4gICAgICAgIHJvdXRlczogKDAsIF9yb3V0ZXMucmVnaXN0ZXJlZFJvdXRlcykoKSxcbiAgICAgICAgcmVkdWNlcnM6ICgwLCBfcmVkdWNlcnMucmVnaXN0ZXJlZFJlZHVjZXJzKSgpXG4gICAgfTtcbn07XG5cbmZ1bmN0aW9uIGluamVjdE1vZHVsZShhKSB7XG4gICAgKDAsIF9zYWdhcy5pbmplY3RTYWdhcykoYS5zYWdhcyk7XG4gICAgKDAsIF9yb3V0ZXMuaW5qZWN0QXV0aGVkUm91dGVzKShhLnJvdXRlcyk7XG4gICAgKDAsIF9yZWR1Y2Vycy5pbmplY3RSZWR1Y2VycykoYS5yZWR1Y2Vycyk7XG5cbiAgICAvLyBpZiBub3QgbnVsbCBpbmplY3QgY3VzdG9tIGxvZ2luIHJvdXRlXG4gICAgaWYgKGEubG9naW5Sb3V0ZXMgIT0gXCJcIiAmJiBhLmxvZ2luUm91dGVzICE9IG51bGwgJiYgYS5sb2dpblJvdXRlcyAhPSBbXSAmJiBhLmxvZ2luUm91dGVzICE9IHt9KSB7XG4gICAgICAgICgwLCBfbG9naW5QYWdlLmluamVjdExvZ2luUm91dGVzKShhLmxvZ2luUm91dGVzKTtcbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuVVNFUl9EQVRBX1NUT1JBR0VfS0VZID0gZXhwb3J0cy5ERVZJQ0VfVE9LRU5fSEVBREVSID0gZXhwb3J0cy5BVVRIX1RPS0VOX0hFQURFUiA9IHVuZGVmaW5lZDtcblxudmFyIF9zdHJpbmdpZnkgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnknKTtcblxudmFyIF9zdHJpbmdpZnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5naWZ5KTtcblxuZXhwb3J0cy5zeW5jU2Vzc2lvblVzZXJUb1N0YXRlID0gc3luY1Nlc3Npb25Vc2VyVG9TdGF0ZTtcbmV4cG9ydHMuYWRkVXNlclRvU2Vzc2lvbiA9IGFkZFVzZXJUb1Nlc3Npb247XG5leHBvcnRzLmdldFVzZXJGcm9tU2Vzc2lvbiA9IGdldFVzZXJGcm9tU2Vzc2lvbjtcbmV4cG9ydHMucmVtb3ZlVXNlckZyb21TZXNzaW9uID0gcmVtb3ZlVXNlckZyb21TZXNzaW9uO1xuZXhwb3J0cy5sb2dvdXQgPSBsb2dvdXQ7XG5leHBvcnRzLnJlcXVpcmVBdXRoVXNlciA9IHJlcXVpcmVBdXRoVXNlcjtcblxudmFyIF9qd3REZWNvZGUgPSByZXF1aXJlKCdqd3QtZGVjb2RlJyk7XG5cbnZhciBfand0RGVjb2RlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2p3dERlY29kZSk7XG5cbnZhciBfYXV0aGVudGljYXRpb25BY3Rpb25zID0gcmVxdWlyZSgnLi4vY29uZmlnL2FjdGlvbnMvYXV0aGVudGljYXRpb25BY3Rpb25zJyk7XG5cbnZhciBfaW5pdCA9IHJlcXVpcmUoJy4uLy4uL2Jhc2UvaW5pdCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgQVVUSF9UT0tFTl9IRUFERVIgPSBleHBvcnRzLkFVVEhfVE9LRU5fSEVBREVSID0gJ1gtQXV0aC1Ub2tlbic7XG52YXIgREVWSUNFX1RPS0VOX0hFQURFUiA9IGV4cG9ydHMuREVWSUNFX1RPS0VOX0hFQURFUiA9ICdYLURldmljZS1Ub2tlbic7XG52YXIgVVNFUl9EQVRBX1NUT1JBR0VfS0VZID0gZXhwb3J0cy5VU0VSX0RBVEFfU1RPUkFHRV9LRVkgPSAnVVNFUl9EQVRBX1NUT1JBR0VfS0VZJztcblxuZnVuY3Rpb24gc3luY1Nlc3Npb25Vc2VyVG9TdGF0ZSgpIHtcbiAgICB2YXIgc2Vzc2lvblVzZXIgPSBnZXRVc2VyRnJvbVNlc3Npb24oKTtcbiAgICAoMCwgX2luaXQuZ2V0U3RvcmUpKCkuZGlzcGF0Y2goKDAsIF9hdXRoZW50aWNhdGlvbkFjdGlvbnMuc2F2ZVVzZXJUb1N0YXRlKShzZXNzaW9uVXNlcikpO1xufVxuXG5mdW5jdGlvbiBhZGRVc2VyVG9TZXNzaW9uKHVzZXJEYXRhKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShVU0VSX0RBVEFfU1RPUkFHRV9LRVksICgwLCBfc3RyaW5naWZ5Mi5kZWZhdWx0KSh1c2VyRGF0YSkpO1xufVxuXG5mdW5jdGlvbiBnZXRVc2VyRnJvbVNlc3Npb24oKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShVU0VSX0RBVEFfU1RPUkFHRV9LRVkpKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVXNlckZyb21TZXNzaW9uKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oQVVUSF9UT0tFTl9IRUFERVIpO1xufVxuXG5mdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgKDAsIF9pbml0LmdldFN0b3JlKSgpLmRpc3BhdGNoKCgwLCBfYXV0aGVudGljYXRpb25BY3Rpb25zLnJlbW92ZVVzZXJGcm9tU3RhdGUpKCkpO1xuICAgIHJlbW92ZVVzZXJGcm9tU2Vzc2lvbigpO1xufVxuXG5mdW5jdGlvbiByZXF1aXJlQXV0aFVzZXIobmV4dFN0YXRlLCByZXBsYWNlKSB7XG4gICAgLy8gbG9vayBmb3IgdG9rZW4gaW4gc2Vzc2lvblxuICAgIHZhciB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oQVVUSF9UT0tFTl9IRUFERVIpO1xuXG4gICAgLy8gdmVyaWZ5IHRva2VuIGV4aXN0c1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgbG9nb3V0KCk7XG4gICAgICAgIHJlcGxhY2Uoe1xuICAgICAgICAgICAgcGF0aG5hbWU6ICcvbG9naW4nXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdmVyaWZ5IHRva2VuIGhhcyBub3QgZXhwaXJlZFxuICAgIHZhciBqd3REYXRhID0gKDAsIF9qd3REZWNvZGUyLmRlZmF1bHQpKHRva2VuKTtcbiAgICB2YXIgdGltZURpZiA9IGp3dERhdGEuZXhwIC0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgaWYgKHRpbWVEaWYgPD0gMCkge1xuICAgICAgICBsb2dvdXQoKTtcbiAgICAgICAgcmVwbGFjZSh7XG4gICAgICAgICAgICBwYXRobmFtZTogJy9sb2dpbidcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB2ZXJpZnkgdG9rZW4gbWF0Y2hlcyB1c2Vyc1xuICAgIHZhciBhdXRoVXNlciA9IGdldFVzZXJGcm9tU2Vzc2lvbigpO1xuICAgIGlmIChqd3REYXRhLnVzZXJJZCAhPT0gYXV0aFVzZXIuaWQpIHtcbiAgICAgICAgbG9nb3V0KCk7XG4gICAgICAgIHJlcGxhY2Uoe1xuICAgICAgICAgICAgcGF0aG5hbWU6ICcvbG9naW4nXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN5bmNTZXNzaW9uVXNlclRvU3RhdGUoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mJyk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjaycpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzQ2FsbENoZWNrMik7XG5cbnZhciBfY3JlYXRlQ2xhc3MyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJyk7XG5cbnZhciBfY3JlYXRlQ2xhc3MzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2xhc3MyKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuJyk7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMik7XG5cbnZhciBfaW5oZXJpdHMyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzJyk7XG5cbnZhciBfaW5oZXJpdHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5oZXJpdHMyKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0UmVkdXggPSByZXF1aXJlKCdyZWFjdC1yZWR1eCcpO1xuXG52YXIgX01haW5NZW51ID0gcmVxdWlyZSgnLi4vY29udGFpbmVycy9hZG1pblBhZ2VzL2NvbXBvbmVudHMvbWFpbk1lbnUvTWFpbk1lbnUnKTtcblxudmFyIF9NYWluTWVudTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9NYWluTWVudSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBBZG1pblRlbXBsYXRlID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShBZG1pblRlbXBsYXRlLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEFkbWluVGVtcGxhdGUocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgQWRtaW5UZW1wbGF0ZSk7XG4gICAgICAgIHJldHVybiAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChBZG1pblRlbXBsYXRlLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShBZG1pblRlbXBsYXRlKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEFkbWluVGVtcGxhdGUsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWEnIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX01haW5NZW51Mi5kZWZhdWx0LCBudWxsKSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgIHsgaWQ6ICdnLWEtbWFpbi1jb250YWluZXInIH0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBBZG1pblRlbXBsYXRlO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuQWRtaW5UZW1wbGF0ZS5wcm9wVHlwZXMgPSB7XG4gICAgY2hpbGRyZW46IF9yZWFjdC5Qcm9wVHlwZXMubm9kZVxufTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlLCBvd25Qcm9wcykge1xuICAgIHJldHVybiB7fTtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9yZWFjdFJlZHV4LmNvbm5lY3QpKG1hcFN0YXRlVG9Qcm9wcywge30pKEFkbWluVGVtcGxhdGUpO1xuIl19