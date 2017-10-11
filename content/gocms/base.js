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
require.register("gocms/base/actions/apiRequestActions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.request = request;
exports.success = success;
exports.failure = failure;
exports.purge = purge;
var REQUEST = exports.REQUEST = 'API_REQUEST';
var SUCCESS = exports.SUCCESS = 'API_SUCCESS';
var FAILURE = exports.FAILURE = 'API_FAIL';
var PURGE = exports.PURGE = 'API_PURGE';

function request(key, data) {
    return {
        type: REQUEST,
        key: key,
        data: data,
        requestedAt: Date.now()
    };
}

function success(key, data) {
    return {
        type: SUCCESS,
        key: key,
        data: data,
        receivedAt: Date.now()
    };
}

function failure(key, err) {
    return {
        type: FAILURE,
        key: key,
        err: err,
        receivedAt: Date.now()
    };
}

function purge(key) {
    return {
        type: PURGE,
        key: key
    };
}

});

;require.register("gocms/base/base_tmpl.js", function(exports, require, module) {
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

var BaseTemplate = function (_React$Component) {
    (0, _inherits3.default)(BaseTemplate, _React$Component);

    function BaseTemplate(props) {
        (0, _classCallCheck3.default)(this, BaseTemplate);
        return (0, _possibleConstructorReturn3.default)(this, (BaseTemplate.__proto__ || (0, _getPrototypeOf2.default)(BaseTemplate)).call(this, props));
    }

    (0, _createClass3.default)(BaseTemplate, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            window.addEventListener('resize', this.handleResize);

            var loaderStyle = document.getElementById("loader-page-wrapper").style;
            var appStyle = document.getElementById("app").style;
            appStyle.overflowY = "hidden";
            // wait for entire dom to finish and then fade loading screen.
            window.onload = function () {
                setTimeout(function () {
                    loaderStyle.opacity = 0;

                    // after fade start we can fade in actual site
                    setTimeout(function () {
                        appStyle.overflowY = "";
                        setTimeout(function () {
                            appStyle.opacity = 1;
                        }, 250);
                    }, 500);
                    // once loading screen is completely gone we can remove it from dom view
                    setTimeout(function () {
                        loaderStyle.display = "none";
                    }, 750);
                }, 250);
            };
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'gocms' },
                this.props.children
            );
        }
    }]);
    return BaseTemplate;
}(_react2.default.Component);

BaseTemplate.propTypes = {
    children: _react.PropTypes.node
};

function mapStateToProps(state, ownProps) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(BaseTemplate);

});

require.register("gocms/base/components/busy/Busy.js", function(exports, require, module) {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GError = function (_React$Component) {
    (0, _inherits3.default)(GError, _React$Component);

    function GError(props) {
        (0, _classCallCheck3.default)(this, GError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GError.__proto__ || (0, _getPrototypeOf2.default)(GError)).call(this, props));

        _this.state = {
            errMessage: _this.props.errMessage || null,
            size: _this.props.size || "20px",
            color: _this.props.color || "#006797",
            margin: _this.props.margin || "0 2%"
        };

        _this.style = {
            width: _this.state.size,
            height: _this.state.size,
            backgroundColor: _this.state.color,
            margin: _this.state.margin
        };
        return _this;
    }

    (0, _createClass3.default)(GError, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.errMessage) {
                this.setState({ errMessage: nextProps.errMessage });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'busy-loader-wrapper' },
                _react2.default.createElement('div', { className: 'busy-loader busy-loader-1', style: this.style }),
                _react2.default.createElement('div', { className: 'busy-loader busy-loader-2', style: this.style }),
                _react2.default.createElement('div', { className: 'busy-loader busy-loader-3', style: this.style })
            );
        }
    }]);
    return GError;
}(_react2.default.Component);

exports.default = GError;

});

require.register("gocms/base/components/gForm/GError.js", function(exports, require, module) {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GError = function (_React$Component) {
    (0, _inherits3.default)(GError, _React$Component);

    function GError(props) {
        (0, _classCallCheck3.default)(this, GError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GError.__proto__ || (0, _getPrototypeOf2.default)(GError)).call(this, props));

        _this.state = {
            errMessage: _this.props.errMessage || null
        };
        return _this;
    }

    (0, _createClass3.default)(GError, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.errMessage) {
                this.setState({ errMessage: nextProps.errMessage });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: "g-error-message " + (this.props.className || "") },
                _react2.default.createElement(
                    _CSSTransitionGroup2.default,
                    { transitionName: 'g-error-message-box-animate',
                        transitionEnterTimeout: 500,
                        transitionLeaveTimeout: 500 },
                    !!this.state.errMessage ? _react2.default.createElement(
                        'h3',
                        null,
                        this.state.errMessage
                    ) : null
                )
            );
        }
    }]);
    return GError;
}(_react2.default.Component);

exports.default = GError;

});

require.register("gocms/base/components/gForm/GForm.js", function(exports, require, module) {
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

var _formsyReact = require('formsy-react');

var _formsyReact2 = _interopRequireDefault(_formsyReact);

var _GSubmit = require('./GSubmit');

var _GSubmit2 = _interopRequireDefault(_GSubmit);

var _GInput = require('./GInput');

var _GInput2 = _interopRequireDefault(_GInput);

var _GTextArea = require('./GTextArea');

var _GTextArea2 = _interopRequireDefault(_GTextArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GForm = function (_React$Component) {
    (0, _inherits3.default)(GForm, _React$Component);

    function GForm(props) {
        (0, _classCallCheck3.default)(this, GForm);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GForm.__proto__ || (0, _getPrototypeOf2.default)(GForm)).call(this, props));

        _this.state = {
            submitButtonIsDisabled: true,
            submitBtnClassName: _this.props.submitBtnClassName || "",
            submitBtnShake: _this.props.submitBtnShake,
            submitBtnBusy: false,
            dirty: false
        };
        _this.handleSubmit = _this.handleSubmit.bind(_this); //bind function once
        _this.disableSubmitButton = _this.disableSubmitButton.bind(_this); //bind function once
        _this.enableSubmitButton = _this.enableSubmitButton.bind(_this); //bind function once

        return _this;
    }

    (0, _createClass3.default)(GForm, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.submitBtnClassName && nextProps.submitBtnClassName != this.props.submitBtnClassName) {
                this.setState({ submitBtnClassName: nextProps.submitBtnClassName });
            }

            // busy button
            if (nextProps.submitBtnBusy) {
                this.setState({
                    submitBtnBusy: true
                });
            } else {
                this.setState({
                    submitBtnBusy: false
                });
            }

            // shake button
            if (nextProps.submitBtnShake) {
                this.setState({
                    submitBtnShake: true
                });
            } else {
                this.setState({
                    submitBtnShake: false
                });
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'enableSubmitButton',
        value: function enableSubmitButton() {
            this.setState({ submitButtonIsDisabled: false });
        }
    }, {
        key: 'disableSubmitButton',
        value: function disableSubmitButton() {
            this.setState({ submitButtonIsDisabled: true });
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(model) {
            if (!!this.props.onSubmit) {
                // if button is "disabled" then don't allow form to submit. Instead show error.
                if (this.state.submitButtonIsDisabled) {

                    this.setState({
                        submitBtnShake: true,
                        dirty: true
                    });
                    // rest button shake after 1 second
                    setTimeout(function () {
                        this.setState({ submitBtnShake: false });
                    }.bind(this), 1000);
                }
                // otherwise submit
                else {
                        this.props.onSubmit(model);
                        this.setState({ submitBtnBusy: true });
                    }
            }
        }
    }, {
        key: 'recursiveCloneChildren',
        value: function recursiveCloneChildren(children) {
            var _this2 = this;

            return _react2.default.Children.map(children, function (child) {
                if (!_react2.default.isValidElement(child)) return child;
                var childProps = {};
                if (!!child.props.children) {
                    childProps.children = _this2.recursiveCloneChildren(child.props.children);
                }
                // if child is GInput add dirty prop
                if (child.type === _GInput2.default || child.type === _GTextArea2.default) {
                    childProps.dirty = _this2.state.dirty;
                    return _react2.default.cloneElement(child, childProps);
                } else {
                    return _react2.default.cloneElement(child, childProps);
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _formsyReact2.default.Form,
                {
                    id: this.props.name,
                    className: "gForm " + (this.props.className || ""),
                    name: this.props.name,
                    onSubmit: this.handleSubmit,
                    onValid: this.enableSubmitButton,
                    onInvalid: this.disableSubmitButton,
                    formNoValidate: true },
                this.recursiveCloneChildren(this.props.children),
                !this.props.submitBtn ? "" : _react2.default.createElement(
                    _GSubmit2.default,
                    { type: 'submit', className: this.state.submitBtnClassName,
                        shake: this.state.submitBtnShake,
                        busy: this.state.submitBtnBusy
                    },
                    this.props.submitBtn
                )
            );
        }
    }]);
    return GForm;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(GForm);

});

require.register("gocms/base/components/gForm/GHidden.js", function(exports, require, module) {
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

var _formsyReact = require('formsy-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GHidden = function (_React$Component) {
    (0, _inherits3.default)(GHidden, _React$Component);

    function GHidden(props) {
        (0, _classCallCheck3.default)(this, GHidden);
        return (0, _possibleConstructorReturn3.default)(this, (GHidden.__proto__ || (0, _getPrototypeOf2.default)(GHidden)).call(this, props));
    }

    (0, _createClass3.default)(GHidden, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement('input', { type: 'hidden',
                name: this.props.name,
                value: this.props.getValue() || ''
            });
        }
    }]);
    return GHidden;
}(_react2.default.Component);

exports.default = (0, _formsyReact.HOC)(GHidden);

});

require.register("gocms/base/components/gForm/GInput.js", function(exports, require, module) {
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

var _formsyReact = require('formsy-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GInput = function (_React$Component) {
    (0, _inherits3.default)(GInput, _React$Component);

    function GInput(props) {
        (0, _classCallCheck3.default)(this, GInput);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GInput.__proto__ || (0, _getPrototypeOf2.default)(GInput)).call(this, props));

        _this.state = {
            blurred: false,
            dirty: false,
            name: _this.props.name || ""
        };
        _this.changeValue = _this.changeValue.bind(_this);
        _this.handelBlur = _this.handelBlur.bind(_this);
        _this.enableSubmitButton = _this.changeValue.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(GInput, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.dirty) {
                this.setState({ dirty: true });
            }

            if (!!nextProps.name) {
                this.setState({ name: nextProps.name });
            }
        }
    }, {
        key: 'changeValue',
        value: function changeValue(event) {
            this.props.setValue(event.currentTarget.value);
            if (!!this.props.onChange) {
                this.props.onChange(event);
            }
        }
    }, {
        key: 'handelBlur',
        value: function handelBlur() {
            if (!!this.props.getValue()) {
                this.setState({ blurred: true });
            } else {
                this.setState({ blurred: false });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var className = this.props.showRequired() ? 'g-input-required' : this.props.showError() ? 'g-input-error' : null;

            // An error message is returned ONLY if the component is invalid
            // or the server has returned an error message
            var errorMessage = [];
            if (this.state.blurred && this.props.getErrorMessage()) {
                errorMessage = this.props.getErrorMessage();
            } else if (this.state.dirty && this.props.showRequired()) {
                errorMessage = "*Required";
            }

            return _react2.default.createElement(
                'div',
                { className: "g-container-col g-input " + (this.props.className || "") },
                _react2.default.createElement(
                    'label',
                    { htmlFor: this.state.name },
                    this.props.label,
                    _react2.default.createElement(
                        _CSSTransitionGroup2.default,
                        { transitionName: 'g-input-error-message-animate',
                            transitionEnterTimeout: 500,
                            transitionLeaveTimeout: 500 },
                        errorMessage != "" ? _react2.default.createElement(
                            'span',
                            { className: 'g-input-error-message' },
                            errorMessage
                        ) : null
                    )
                ),
                _react2.default.createElement('input', { type: this.props.type,
                    name: this.state.name,
                    onChange: this.changeValue,
                    onBlur: this.handelBlur,
                    value: this.props.getValue() || ''
                })
            );
        }
    }]);
    return GInput;
}(_react2.default.Component);

exports.default = (0, _formsyReact.HOC)(GInput);

});

require.register("gocms/base/components/gForm/GSubmit.js", function(exports, require, module) {
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

var _Busy = require('../busy/Busy');

var _Busy2 = _interopRequireDefault(_Busy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GSubmit = function (_React$Component) {
    (0, _inherits3.default)(GSubmit, _React$Component);

    function GSubmit(props) {
        (0, _classCallCheck3.default)(this, GSubmit);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GSubmit.__proto__ || (0, _getPrototypeOf2.default)(GSubmit)).call(this, props));

        _this.state = {
            shake: false,
            disabled: _this.props.disabled,
            className: _this.props.className || "",
            busy: false
        };

        return _this;
    }

    (0, _createClass3.default)(GSubmit, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // disabled
            if (!!nextProps.disabled) {
                this.setState({ disabled: true });
            } else {
                this.setState({ disabled: false });
            }

            // shake
            if (nextProps.shake) {
                this.setState({ shake: true });
            } else {
                this.setState({ shake: false });
            }

            // busy
            if (nextProps.busy) {
                this.setState({ busy: true });
            } else {
                this.setState({ busy: false });
            }

            // className
            if (!!nextProps.className && nextProps.className != this.state.className) {
                this.setState({ className: nextProps.className });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {

            var html = null;

            // if the button shakes stop it!
            if (this.state.shake) {
                setTimeout(function () {
                    this.setState({ shake: false });
                }.bind(this), 1000);
            }

            // if we are not busy show the button
            if (!this.state.busy) {
                html = _react2.default.createElement(
                    'button',
                    { type: 'submit',
                        className: "btn" + (" " + this.state.className || "") + (this.state.shake ? " btn-animate-shake" : " ")
                    },
                    this.props.children
                );
            }
            // else show the busy button
            else {
                    html = _react2.default.createElement(
                        'button',
                        { type: 'submit',
                            className: "btn" + (" " + this.state.className || ""),
                            disabled: true
                        },
                        _react2.default.createElement(_Busy2.default, null)
                    );
                }

            return html;
        }
    }]);
    return GSubmit;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(GSubmit);

});

require.register("gocms/base/components/gForm/GTextArea.js", function(exports, require, module) {
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

var _formsyReact = require('formsy-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GTextArea = function (_React$Component) {
    (0, _inherits3.default)(GTextArea, _React$Component);

    function GTextArea(props) {
        (0, _classCallCheck3.default)(this, GTextArea);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GTextArea.__proto__ || (0, _getPrototypeOf2.default)(GTextArea)).call(this, props));

        _this.state = {
            blurred: false,
            dirty: false,
            name: _this.props.name || ""
        };
        _this.changeValue = _this.changeValue.bind(_this);
        _this.handelBlur = _this.handelBlur.bind(_this);
        _this.enableSubmitButton = _this.changeValue.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(GTextArea, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.dirty) {
                this.setState({ dirty: true });
            }

            if (!!nextProps.name) {
                this.setState({ name: nextProps.name });
            }
        }
    }, {
        key: 'changeValue',
        value: function changeValue(event) {
            this.props.setValue(event.currentTarget.value);
            if (!!this.props.onChange) {
                this.props.onChange(event);
            }
        }
    }, {
        key: 'handelBlur',
        value: function handelBlur() {
            if (!!this.props.getValue()) {
                this.setState({ blurred: true });
            } else {
                this.setState({ blurred: false });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var className = this.props.showRequired() ? 'g-input-required' : this.props.showError() ? 'g-input-required' : null;

            // An error message is returned ONLY if the component is invalid
            // or the server has returned an error message
            var errorMessage = [];
            if (this.state.blurred && this.props.getErrorMessage()) {
                errorMessage = this.props.getErrorMessage();
            } else if (this.state.dirty && this.props.showRequired()) {
                errorMessage = "*Required";
            }

            return _react2.default.createElement(
                'div',
                { className: "g-container-col g-input " + (this.props.className || "") },
                _react2.default.createElement(
                    'label',
                    { htmlFor: this.state.name },
                    this.props.label,
                    _react2.default.createElement(
                        _CSSTransitionGroup2.default,
                        { transitionName: 'g-input-error-message-animate',
                            transitionEnterTimeout: 500,
                            transitionLeaveTimeout: 500 },
                        errorMessage != "" ? _react2.default.createElement(
                            'span',
                            { className: 'g-input-error-message' },
                            errorMessage
                        ) : null
                    )
                ),
                _react2.default.createElement('textarea', { type: this.props.type,
                    name: this.props.name,
                    onChange: this.changeValue,
                    onBlur: this.handelBlur,
                    value: this.props.getValue() || ''
                })
            );
        }
    }]);
    return GTextArea;
}(_react2.default.Component);

exports.default = (0, _formsyReact.HOC)(GTextArea);

});

require.register("gocms/base/init.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = run;
exports.getStore = getStore;
exports.injectModule = injectModule;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _sagas = require('./sagas/sagas');

var _routes = require('./router/routes');

var _reducers = require('./reducers/reducers');

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _reactRouterRedux = require('react-router-redux');

var _configureStore = require('./store/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = null;
var history = null;
var routes = null;

// regular render
function run() {
    // init store, sagas, history, and routes
    store = (0, _configureStore2.default)(window.__INITIAL_STATE__, (0, _reducers.rootReducer)());
    store.runSaga((0, _sagas.rootSaga)(), store.dispatch);
    history = (0, _reactRouterRedux.syncHistoryWithStore)(_reactRouter.browserHistory, store);
    routes = (0, _routes.registeredRoutes)();

    // render out doc
    (0, _reactDom.render)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(_reactRouter.Router, { onUpdate: function onUpdate() {
                return window.scrollTo(0, 0);
            }, history: history, routes: routes })
    ), document.getElementById('app'));
}

function getStore() {
    return store;
}

function injectModule(a) {
    (0, _sagas.injectSagas)(a.sagas);
    (0, _routes.injectRoutes)(a.routes);
    (0, _reducers.injectReducers)(a.reducers);
}

});

;require.register("gocms/base/reducers/apiRequestReducers.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends5 = require('babel-runtime/helpers/extends');

var _extends6 = _interopRequireDefault(_extends5);

var _redux = require('redux');

var _apiRequestActions = require('../actions/apiRequestActions');

var actions = _interopRequireWildcard(_apiRequestActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function apiRequestReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    var key = action.key;
    switch (action.type) {
        case actions.REQUEST:
            return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, key, (0, _extends6.default)({}, state[key], {
                key: action.key,
                isFetching: true,
                requestedAt: action.requestedAt
            })));
        case actions.SUCCESS:
            return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, key, (0, _extends6.default)({}, state[key], {
                key: action.key,
                isFetching: false,
                receivedAt: action.receivedAt,
                data: action.data
            })));
        case actions.FAILURE:
            return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, key, (0, _extends6.default)({}, state[key], {
                key: action.key,
                isFetching: false,
                receivedAt: action.receivedAt,
                err: action.err
            })));
        case actions.PURGE:
            var s = (0, _extends6.default)({}, state);
            delete s[key];
            return s;
        default:
            return state;
    }
}

var apiRequestReducers = (0, _redux.combineReducers)({
    request: apiRequestReducer
});

exports.default = apiRequestReducers;

});

require.register("gocms/base/reducers/reducers.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.injectReducers = injectReducers;
exports.rootReducer = rootReducer;

var _reactRouterRedux = require('react-router-redux');

var _redux = require('redux');

var _apiRequestReducers = require('./apiRequestReducers');

var _apiRequestReducers2 = _interopRequireDefault(_apiRequestReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedReducers = {};

function injectReducers(r) {
    injectedReducers = (0, _assign2.default)({}, r, injectedReducers);
}

function rootReducer() {
    return (0, _redux.combineReducers)((0, _extends3.default)({
        api: _apiRequestReducers2.default
    }, injectedReducers, {
        routing: _reactRouterRedux.routerReducer
    }));
}

});

;require.register("gocms/base/router/routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectRoutes = injectRoutes;
exports.registeredRoutes = registeredRoutes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _base_tmpl = require('../base_tmpl');

var _base_tmpl2 = _interopRequireDefault(_base_tmpl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedRoutes = [];
var routes = _react2.default.createElement(
    _reactRouter.Route,
    { component: _base_tmpl2.default },
    injectedRoutes
);

function injectRoutes(r) {
    injectedRoutes.push(r);
}

function registeredRoutes() {
    return routes;
}

});

;require.register("gocms/base/sagas/sagas.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.rootSaga = rootSaga;
exports.injectSagas = injectSagas;

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedSagas = [];

function rootSaga() {
    return (/*#__PURE__*/_regenerator2.default.mark(function _callee() {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return [].concat(injectedSagas);

                        case 2:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })
    );
}

function injectSagas(s) {
    injectedSagas.push((0, _effects.fork)(s));
}

});

;require.register("gocms/base/services/api.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ENDPOINTS = exports.USER_DATA_STORAGE_KEY = exports.DEVICE_TOKEN_HEADER = exports.AUTH_TOKEN_HEADER = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.Get = Get;
exports.Post = Post;
exports.Put = Put;
exports.Delete = Delete;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AUTH_TOKEN_HEADER = exports.AUTH_TOKEN_HEADER = 'X-Auth-Token';
var DEVICE_TOKEN_HEADER = exports.DEVICE_TOKEN_HEADER = 'X-Device-Token';
var USER_DATA_STORAGE_KEY = exports.USER_DATA_STORAGE_KEY = 'USER_DATA_STORAGE_KEY';
var ENDPOINTS = exports.ENDPOINTS = {
    login: "/api/login"
};

var defaultOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default',
    method: 'GET',
    body: null
};

var Api = function () {
    function Api(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        (0, _classCallCheck3.default)(this, Api);

        this.url = url;
        this.options = (0, _assign2.default)(defaultOptions, options);

        // add auth headers if they are present
        if (!!sessionStorage.getItem(AUTH_TOKEN_HEADER)) {
            this.options.headers[AUTH_TOKEN_HEADER] = sessionStorage.getItem(AUTH_TOKEN_HEADER);
        }
        if (!!sessionStorage.getItem(DEVICE_TOKEN_HEADER)) {
            this.options.headers[DEVICE_TOKEN_HEADER] = sessionStorage.getItem(DEVICE_TOKEN_HEADER);
        }

        this.fetch = _isomorphicFetch2.default;
    }

    (0, _createClass3.default)(Api, [{
        key: 'callApi',
        value: function callApi() {
            return this.fetch(this.url, this.options).then(function (res) {
                if (res.status >= 200 && res.status < 300) {
                    // if we receive an auth token we should add this to the storage
                    if (res.headers.has(AUTH_TOKEN_HEADER)) {
                        sessionStorage.setItem(AUTH_TOKEN_HEADER, res.headers.get(AUTH_TOKEN_HEADER));
                    }
                    // if we receive a device token we should add this to the storage
                    if (res.headers.has(DEVICE_TOKEN_HEADER)) {
                        sessionStorage.setItem(DEVICE_TOKEN_HEADER, res.headers.get(DEVICE_TOKEN_HEADER));
                    }

                    return res.json().then(function (json) {
                        return { status: res.status, json: json };
                    }).catch(function (e) {
                        return { status: res.status }; // not really an error. If request wasn't a json request then skip
                    });
                } else {
                    // try to get error message from json
                    return res.json().then(function (json) {
                        return _promise2.default.reject({ status: res.status, json: json });
                    }).catch(function (e) {
                        switch (e.status) {
                            case 401:
                            case 403:
                                sessionStorage.removeItem(AUTH_TOKEN_HEADER);
                                return _promise2.default.reject(e);
                            default:
                                return _promise2.default.reject(e);
                        }
                    });
                }
            })
            //         // todo then we need to add a success handler to the contact form so that people only submit once
            //         // todo then we need to update the forms to allow for subit and error as apposed to just a disabled btn
            .then(function (res) {
                // success
                return { res: res };
            }, function (err) {
                //fail
                return { err: err };
            });
        }
    }]);
    return Api;
}();

exports.default = Api;
function Get(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options.method = "GET";
    return new Api(url, options).callApi();
}

function Post(url, body) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    options.method = "POST";

    // stringify body if needed
    if (!!body) {
        options.body = (0, _stringify2.default)(body);
    }
    return new Api(url, options).callApi();
}

function Put(url, body) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    options.method = "PUT";

    // stringify body if needed
    if (!!body) {
        options.body = (0, _stringify2.default)(body);
    }
    return new Api(url, options).callApi();
}

function Delete(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options.method = "Delete";
    return new Api(url, options).callApi();
}

});

;require.register("gocms/base/store/configureStore.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reduxLogger = require('redux-logger');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureStore(initialState, rootReducer) {

    var sagaMiddleware = (0, _reduxSaga2.default)();
    var logger = (0, _reduxLogger.createLogger)({
        collapsed: true
    });

    var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
    var store = (0, _redux.createStore)(rootReducer, initialState, composeEnhancers((0, _redux.applyMiddleware)(sagaMiddleware, logger)));

    store.runSaga = sagaMiddleware.run;
    store.close = function () {
        return store.dispatch(_reduxSaga.END);
    };

    return store;
}

});

;require.register("gocms/initialize.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = run;
function run(withAdmin, activePlugins, activeAdminPlugins, activeTheme) {

    // first get goCMS base
    var goCMSBase = require('./base/init.js');

    if (!!window.MSInputMethodContext && !!document.documentMode) {
        console.log("IE11: Loading promise polyfill");
        require('es6-promise').polyfill();
    }

    // check to see if we are loading admin section
    if (!!withAdmin) {
        var goCMSAdmin = require('./admin/init.js');
        for (var i = 0; i < activeAdminPlugins.length; i++) {
            var activeAdminPluginInit = activeAdminPlugins[i] + "/admin/config/init.js";
            var activeAdminPlugin = require(activeAdminPluginInit).default;
            goCMSAdmin.injectModule(activeAdminPlugin);
        }
        goCMSBase.injectModule(goCMSAdmin.getModule());
    }

    for (var _i = 0; _i < activePlugins.length; _i++) {
        var activePluginInit = activePlugins[_i] + "/public/config/init.js";
        var activePlugin = require(activePluginInit).default;
        goCMSBase.injectModule(activePlugin);
    }

    // load the theme
    var themeInit = activeTheme + '/theme/config/init.js';
    var goCMSTheme = require(themeInit).default;
    goCMSBase.injectModule(goCMSTheme);

    // run the cms
    goCMSBase.run();
}

});

;require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvYWN0aW9ucy9hcGlSZXF1ZXN0QWN0aW9ucy5qcyIsImJhc2UvYmFzZV90bXBsLmpzIiwiYmFzZS9jb21wb25lbnRzL2J1c3kvQnVzeS5qcyIsImJhc2UvY29tcG9uZW50cy9nRm9ybS9HRXJyb3IuanMiLCJiYXNlL2NvbXBvbmVudHMvZ0Zvcm0vR0Zvcm0uanMiLCJiYXNlL2NvbXBvbmVudHMvZ0Zvcm0vR0hpZGRlbi5qcyIsImJhc2UvY29tcG9uZW50cy9nRm9ybS9HSW5wdXQuanMiLCJiYXNlL2NvbXBvbmVudHMvZ0Zvcm0vR1N1Ym1pdC5qcyIsImJhc2UvY29tcG9uZW50cy9nRm9ybS9HVGV4dEFyZWEuanMiLCJiYXNlL2luaXQuanMiLCJiYXNlL3JlZHVjZXJzL2FwaVJlcXVlc3RSZWR1Y2Vycy5qcyIsImJhc2UvcmVkdWNlcnMvcmVkdWNlcnMuanMiLCJiYXNlL3JvdXRlci9yb3V0ZXMuanMiLCJiYXNlL3NhZ2FzL3NhZ2FzLmpzIiwiYmFzZS9zZXJ2aWNlcy9hcGkuanMiLCJiYXNlL3N0b3JlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiaW5pdGlhbGl6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQS9DQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBM0ZBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5GQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWpGQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBak1BO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTNEQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFuSUE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdElBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5JQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaEVBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoRUE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXhDQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbENBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXpDQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWxLQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbENBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXpDQTtBQUFBIiwiZmlsZSI6Ii4uL2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucmVxdWVzdCA9IHJlcXVlc3Q7XG5leHBvcnRzLnN1Y2Nlc3MgPSBzdWNjZXNzO1xuZXhwb3J0cy5mYWlsdXJlID0gZmFpbHVyZTtcbmV4cG9ydHMucHVyZ2UgPSBwdXJnZTtcbnZhciBSRVFVRVNUID0gZXhwb3J0cy5SRVFVRVNUID0gJ0FQSV9SRVFVRVNUJztcbnZhciBTVUNDRVNTID0gZXhwb3J0cy5TVUNDRVNTID0gJ0FQSV9TVUNDRVNTJztcbnZhciBGQUlMVVJFID0gZXhwb3J0cy5GQUlMVVJFID0gJ0FQSV9GQUlMJztcbnZhciBQVVJHRSA9IGV4cG9ydHMuUFVSR0UgPSAnQVBJX1BVUkdFJztcblxuZnVuY3Rpb24gcmVxdWVzdChrZXksIGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBSRVFVRVNULFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgcmVxdWVzdGVkQXQ6IERhdGUubm93KClcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBzdWNjZXNzKGtleSwgZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFNVQ0NFU1MsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICByZWNlaXZlZEF0OiBEYXRlLm5vdygpXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZmFpbHVyZShrZXksIGVycikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IEZBSUxVUkUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBlcnI6IGVycixcbiAgICAgICAgcmVjZWl2ZWRBdDogRGF0ZS5ub3coKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHB1cmdlKGtleSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFBVUkdFLFxuICAgICAgICBrZXk6IGtleVxuICAgIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEJhc2VUZW1wbGF0ZSA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoQmFzZVRlbXBsYXRlLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEJhc2VUZW1wbGF0ZShwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBCYXNlVGVtcGxhdGUpO1xuICAgICAgICByZXR1cm4gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoQmFzZVRlbXBsYXRlLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShCYXNlVGVtcGxhdGUpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoQmFzZVRlbXBsYXRlLCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG5cbiAgICAgICAgICAgIHZhciBsb2FkZXJTdHlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGVyLXBhZ2Utd3JhcHBlclwiKS5zdHlsZTtcbiAgICAgICAgICAgIHZhciBhcHBTdHlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpLnN0eWxlO1xuICAgICAgICAgICAgYXBwU3R5bGUub3ZlcmZsb3dZID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIC8vIHdhaXQgZm9yIGVudGlyZSBkb20gdG8gZmluaXNoIGFuZCB0aGVuIGZhZGUgbG9hZGluZyBzY3JlZW4uXG4gICAgICAgICAgICB3aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsb2FkZXJTdHlsZS5vcGFjaXR5ID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciBmYWRlIHN0YXJ0IHdlIGNhbiBmYWRlIGluIGFjdHVhbCBzaXRlXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwU3R5bGUub3ZlcmZsb3dZID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcFN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gb25jZSBsb2FkaW5nIHNjcmVlbiBpcyBjb21wbGV0ZWx5IGdvbmUgd2UgY2FuIHJlbW92ZSBpdCBmcm9tIGRvbSB2aWV3XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVyU3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICB9LCA3NTApO1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgaWQ6ICdnb2NtcycgfSxcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBCYXNlVGVtcGxhdGU7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5CYXNlVGVtcGxhdGUucHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLm5vZGVcbn07XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSwgb3duUHJvcHMpIHtcbiAgICByZXR1cm4ge307XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfcmVhY3RSZWR1eC5jb25uZWN0KShtYXBTdGF0ZVRvUHJvcHMsIHt9KShCYXNlVGVtcGxhdGUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZSgncmVhY3QtdHJhbnNpdGlvbi1ncm91cC9DU1NUcmFuc2l0aW9uR3JvdXAnKTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ1NTVHJhbnNpdGlvbkdyb3VwKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEdFcnJvciA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoR0Vycm9yLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEdFcnJvcihwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBHRXJyb3IpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9ICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKEdFcnJvci5fX3Byb3RvX18gfHwgKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoR0Vycm9yKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgZXJyTWVzc2FnZTogX3RoaXMucHJvcHMuZXJyTWVzc2FnZSB8fCBudWxsLFxuICAgICAgICAgICAgc2l6ZTogX3RoaXMucHJvcHMuc2l6ZSB8fCBcIjIwcHhcIixcbiAgICAgICAgICAgIGNvbG9yOiBfdGhpcy5wcm9wcy5jb2xvciB8fCBcIiMwMDY3OTdcIixcbiAgICAgICAgICAgIG1hcmdpbjogX3RoaXMucHJvcHMubWFyZ2luIHx8IFwiMCAyJVwiXG4gICAgICAgIH07XG5cbiAgICAgICAgX3RoaXMuc3R5bGUgPSB7XG4gICAgICAgICAgICB3aWR0aDogX3RoaXMuc3RhdGUuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogX3RoaXMuc3RhdGUuc2l6ZSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogX3RoaXMuc3RhdGUuY29sb3IsXG4gICAgICAgICAgICBtYXJnaW46IF90aGlzLnN0YXRlLm1hcmdpblxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoR0Vycm9yLCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgICAgICBpZiAoISFuZXh0UHJvcHMuZXJyTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJNZXNzYWdlOiBuZXh0UHJvcHMuZXJyTWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2J1c3ktbG9hZGVyLXdyYXBwZXInIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiAnYnVzeS1sb2FkZXIgYnVzeS1sb2FkZXItMScsIHN0eWxlOiB0aGlzLnN0eWxlIH0pLFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogJ2J1c3ktbG9hZGVyIGJ1c3ktbG9hZGVyLTInLCBzdHlsZTogdGhpcy5zdHlsZSB9KSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdidXN5LWxvYWRlciBidXN5LWxvYWRlci0zJywgc3R5bGU6IHRoaXMuc3R5bGUgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEdFcnJvcjtcbn0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEdFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mJyk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjaycpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzQ2FsbENoZWNrMik7XG5cbnZhciBfY3JlYXRlQ2xhc3MyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJyk7XG5cbnZhciBfY3JlYXRlQ2xhc3MzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2xhc3MyKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuJyk7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMik7XG5cbnZhciBfaW5oZXJpdHMyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzJyk7XG5cbnZhciBfaW5oZXJpdHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5oZXJpdHMyKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cCA9IHJlcXVpcmUoJ3JlYWN0LXRyYW5zaXRpb24tZ3JvdXAvQ1NTVHJhbnNpdGlvbkdyb3VwJyk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0NTU1RyYW5zaXRpb25Hcm91cCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBHRXJyb3IgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKEdFcnJvciwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBHRXJyb3IocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgR0Vycm9yKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChHRXJyb3IuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEdFcnJvcikpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGVyck1lc3NhZ2U6IF90aGlzLnByb3BzLmVyck1lc3NhZ2UgfHwgbnVsbFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoR0Vycm9yLCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgICAgICBpZiAoISFuZXh0UHJvcHMuZXJyTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJNZXNzYWdlOiBuZXh0UHJvcHMuZXJyTWVzc2FnZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogXCJnLWVycm9yLW1lc3NhZ2UgXCIgKyAodGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgXCJcIikgfSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgX0NTU1RyYW5zaXRpb25Hcm91cDIuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgeyB0cmFuc2l0aW9uTmFtZTogJ2ctZXJyb3ItbWVzc2FnZS1ib3gtYW5pbWF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0OiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0OiA1MDAgfSxcbiAgICAgICAgICAgICAgICAgICAgISF0aGlzLnN0YXRlLmVyck1lc3NhZ2UgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdoMycsXG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5lcnJNZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICkgOiBudWxsXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gR0Vycm9yO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gR0Vycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbnZhciBfZm9ybXN5UmVhY3QgPSByZXF1aXJlKCdmb3Jtc3ktcmVhY3QnKTtcblxudmFyIF9mb3Jtc3lSZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mb3Jtc3lSZWFjdCk7XG5cbnZhciBfR1N1Ym1pdCA9IHJlcXVpcmUoJy4vR1N1Ym1pdCcpO1xuXG52YXIgX0dTdWJtaXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfR1N1Ym1pdCk7XG5cbnZhciBfR0lucHV0ID0gcmVxdWlyZSgnLi9HSW5wdXQnKTtcblxudmFyIF9HSW5wdXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfR0lucHV0KTtcblxudmFyIF9HVGV4dEFyZWEgPSByZXF1aXJlKCcuL0dUZXh0QXJlYScpO1xuXG52YXIgX0dUZXh0QXJlYTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9HVGV4dEFyZWEpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR0Zvcm0gPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKEdGb3JtLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEdGb3JtKHByb3BzKSB7XG4gICAgICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szLmRlZmF1bHQpKHRoaXMsIEdGb3JtKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChHRm9ybS5fX3Byb3RvX18gfHwgKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoR0Zvcm0pKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBzdWJtaXRCdXR0b25Jc0Rpc2FibGVkOiB0cnVlLFxuICAgICAgICAgICAgc3VibWl0QnRuQ2xhc3NOYW1lOiBfdGhpcy5wcm9wcy5zdWJtaXRCdG5DbGFzc05hbWUgfHwgXCJcIixcbiAgICAgICAgICAgIHN1Ym1pdEJ0blNoYWtlOiBfdGhpcy5wcm9wcy5zdWJtaXRCdG5TaGFrZSxcbiAgICAgICAgICAgIHN1Ym1pdEJ0bkJ1c3k6IGZhbHNlLFxuICAgICAgICAgICAgZGlydHk6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIF90aGlzLmhhbmRsZVN1Ym1pdCA9IF90aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKF90aGlzKTsgLy9iaW5kIGZ1bmN0aW9uIG9uY2VcbiAgICAgICAgX3RoaXMuZGlzYWJsZVN1Ym1pdEJ1dHRvbiA9IF90aGlzLmRpc2FibGVTdWJtaXRCdXR0b24uYmluZChfdGhpcyk7IC8vYmluZCBmdW5jdGlvbiBvbmNlXG4gICAgICAgIF90aGlzLmVuYWJsZVN1Ym1pdEJ1dHRvbiA9IF90aGlzLmVuYWJsZVN1Ym1pdEJ1dHRvbi5iaW5kKF90aGlzKTsgLy9iaW5kIGZ1bmN0aW9uIG9uY2VcblxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoR0Zvcm0sIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIGlmICghIW5leHRQcm9wcy5zdWJtaXRCdG5DbGFzc05hbWUgJiYgbmV4dFByb3BzLnN1Ym1pdEJ0bkNsYXNzTmFtZSAhPSB0aGlzLnByb3BzLnN1Ym1pdEJ0bkNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzdWJtaXRCdG5DbGFzc05hbWU6IG5leHRQcm9wcy5zdWJtaXRCdG5DbGFzc05hbWUgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJ1c3kgYnV0dG9uXG4gICAgICAgICAgICBpZiAobmV4dFByb3BzLnN1Ym1pdEJ0bkJ1c3kpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0QnRuQnVzeTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0QnRuQnVzeTogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2hha2UgYnV0dG9uXG4gICAgICAgICAgICBpZiAobmV4dFByb3BzLnN1Ym1pdEJ0blNoYWtlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ0blNoYWtlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXRCdG5TaGFrZTogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHt9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHt9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdlbmFibGVTdWJtaXRCdXR0b24nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlU3VibWl0QnV0dG9uKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN1Ym1pdEJ1dHRvbklzRGlzYWJsZWQ6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdkaXNhYmxlU3VibWl0QnV0dG9uJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2FibGVTdWJtaXRCdXR0b24oKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc3VibWl0QnV0dG9uSXNEaXNhYmxlZDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGFuZGxlU3VibWl0JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChtb2RlbCkge1xuICAgICAgICAgICAgaWYgKCEhdGhpcy5wcm9wcy5vblN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGJ1dHRvbiBpcyBcImRpc2FibGVkXCIgdGhlbiBkb24ndCBhbGxvdyBmb3JtIHRvIHN1Ym1pdC4gSW5zdGVhZCBzaG93IGVycm9yLlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnN1Ym1pdEJ1dHRvbklzRGlzYWJsZWQpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ0blNoYWtlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlydHk6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc3QgYnV0dG9uIHNoYWtlIGFmdGVyIDEgc2Vjb25kXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN1Ym1pdEJ0blNoYWtlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHN1Ym1pdFxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vblN1Ym1pdChtb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc3VibWl0QnRuQnVzeTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZWN1cnNpdmVDbG9uZUNoaWxkcmVuJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlY3Vyc2l2ZUNsb25lQ2hpbGRyZW4oY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfcmVhY3QyLmRlZmF1bHQuaXNWYWxpZEVsZW1lbnQoY2hpbGQpKSByZXR1cm4gY2hpbGQ7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkUHJvcHMgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoISFjaGlsZC5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZFByb3BzLmNoaWxkcmVuID0gX3RoaXMyLnJlY3Vyc2l2ZUNsb25lQ2hpbGRyZW4oY2hpbGQucHJvcHMuY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiBjaGlsZCBpcyBHSW5wdXQgYWRkIGRpcnR5IHByb3BcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gX0dJbnB1dDIuZGVmYXVsdCB8fCBjaGlsZC50eXBlID09PSBfR1RleHRBcmVhMi5kZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkUHJvcHMuZGlydHkgPSBfdGhpczIuc3RhdGUuZGlydHk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY2xvbmVFbGVtZW50KGNoaWxkLCBjaGlsZFByb3BzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNsb25lRWxlbWVudChjaGlsZCwgY2hpbGRQcm9wcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgX2Zvcm1zeVJlYWN0Mi5kZWZhdWx0LkZvcm0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5wcm9wcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZ0Zvcm0gXCIgKyAodGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgXCJcIiksXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMucHJvcHMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgb25TdWJtaXQ6IHRoaXMuaGFuZGxlU3VibWl0LFxuICAgICAgICAgICAgICAgICAgICBvblZhbGlkOiB0aGlzLmVuYWJsZVN1Ym1pdEJ1dHRvbixcbiAgICAgICAgICAgICAgICAgICAgb25JbnZhbGlkOiB0aGlzLmRpc2FibGVTdWJtaXRCdXR0b24sXG4gICAgICAgICAgICAgICAgICAgIGZvcm1Ob1ZhbGlkYXRlOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgdGhpcy5yZWN1cnNpdmVDbG9uZUNoaWxkcmVuKHRoaXMucHJvcHMuY2hpbGRyZW4pLFxuICAgICAgICAgICAgICAgICF0aGlzLnByb3BzLnN1Ym1pdEJ0biA/IFwiXCIgOiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgX0dTdWJtaXQyLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ3N1Ym1pdCcsIGNsYXNzTmFtZTogdGhpcy5zdGF0ZS5zdWJtaXRCdG5DbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFrZTogdGhpcy5zdGF0ZS5zdWJtaXRCdG5TaGFrZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1c3k6IHRoaXMuc3RhdGUuc3VibWl0QnRuQnVzeVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnN1Ym1pdEJ0blxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEdGb3JtO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gICAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7fSkoR0Zvcm0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZSgncmVhY3QtdHJhbnNpdGlvbi1ncm91cC9DU1NUcmFuc2l0aW9uR3JvdXAnKTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ1NTVHJhbnNpdGlvbkdyb3VwKTtcblxudmFyIF9mb3Jtc3lSZWFjdCA9IHJlcXVpcmUoJ2Zvcm1zeS1yZWFjdCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR0hpZGRlbiA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoR0hpZGRlbiwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBHSGlkZGVuKHByb3BzKSB7XG4gICAgICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szLmRlZmF1bHQpKHRoaXMsIEdIaWRkZW4pO1xuICAgICAgICByZXR1cm4gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoR0hpZGRlbi5fX3Byb3RvX18gfHwgKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoR0hpZGRlbikpLmNhbGwodGhpcywgcHJvcHMpKTtcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShHSGlkZGVuLCBbe1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIHsgdHlwZTogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgbmFtZTogdGhpcy5wcm9wcy5uYW1lLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnByb3BzLmdldFZhbHVlKCkgfHwgJydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBHSGlkZGVuO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9mb3Jtc3lSZWFjdC5IT0MpKEdIaWRkZW4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZSgncmVhY3QtdHJhbnNpdGlvbi1ncm91cC9DU1NUcmFuc2l0aW9uR3JvdXAnKTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ1NTVHJhbnNpdGlvbkdyb3VwKTtcblxudmFyIF9mb3Jtc3lSZWFjdCA9IHJlcXVpcmUoJ2Zvcm1zeS1yZWFjdCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR0lucHV0ID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShHSW5wdXQsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gR0lucHV0KHByb3BzKSB7XG4gICAgICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szLmRlZmF1bHQpKHRoaXMsIEdJbnB1dCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoR0lucHV0Ll9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShHSW5wdXQpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBibHVycmVkOiBmYWxzZSxcbiAgICAgICAgICAgIGRpcnR5OiBmYWxzZSxcbiAgICAgICAgICAgIG5hbWU6IF90aGlzLnByb3BzLm5hbWUgfHwgXCJcIlxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5jaGFuZ2VWYWx1ZSA9IF90aGlzLmNoYW5nZVZhbHVlLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5oYW5kZWxCbHVyID0gX3RoaXMuaGFuZGVsQmx1ci5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuZW5hYmxlU3VibWl0QnV0dG9uID0gX3RoaXMuY2hhbmdlVmFsdWUuYmluZChfdGhpcyk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShHSW5wdXQsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIGlmICghIW5leHRQcm9wcy5kaXJ0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkaXJ0eTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCEhbmV4dFByb3BzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmFtZTogbmV4dFByb3BzLm5hbWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NoYW5nZVZhbHVlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZVZhbHVlKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnNldFZhbHVlKGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgaWYgKCEhdGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdoYW5kZWxCbHVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRlbEJsdXIoKSB7XG4gICAgICAgICAgICBpZiAoISF0aGlzLnByb3BzLmdldFZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYmx1cnJlZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJsdXJyZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMucHJvcHMuc2hvd1JlcXVpcmVkKCkgPyAnZy1pbnB1dC1yZXF1aXJlZCcgOiB0aGlzLnByb3BzLnNob3dFcnJvcigpID8gJ2ctaW5wdXQtZXJyb3InIDogbnVsbDtcblxuICAgICAgICAgICAgLy8gQW4gZXJyb3IgbWVzc2FnZSBpcyByZXR1cm5lZCBPTkxZIGlmIHRoZSBjb21wb25lbnQgaXMgaW52YWxpZFxuICAgICAgICAgICAgLy8gb3IgdGhlIHNlcnZlciBoYXMgcmV0dXJuZWQgYW4gZXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IFtdO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuYmx1cnJlZCAmJiB0aGlzLnByb3BzLmdldEVycm9yTWVzc2FnZSgpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gdGhpcy5wcm9wcy5nZXRFcnJvck1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5kaXJ0eSAmJiB0aGlzLnByb3BzLnNob3dSZXF1aXJlZCgpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gXCIqUmVxdWlyZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBcImctY29udGFpbmVyLWNvbCBnLWlucHV0IFwiICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lIHx8IFwiXCIpIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAgICAgICAgIHsgaHRtbEZvcjogdGhpcy5zdGF0ZS5uYW1lIH0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgX0NTU1RyYW5zaXRpb25Hcm91cDIuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHJhbnNpdGlvbk5hbWU6ICdnLWlucHV0LWVycm9yLW1lc3NhZ2UtYW5pbWF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ6IDUwMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlICE9IFwiXCIgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWlucHV0LWVycm9yLW1lc3NhZ2UnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGU6IHRoaXMucHJvcHMudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdGhpcy5jaGFuZ2VWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgb25CbHVyOiB0aGlzLmhhbmRlbEJsdXIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnByb3BzLmdldFZhbHVlKCkgfHwgJydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gR0lucHV0O1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9mb3Jtc3lSZWFjdC5IT0MpKEdJbnB1dCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxudmFyIF9CdXN5ID0gcmVxdWlyZSgnLi4vYnVzeS9CdXN5Jyk7XG5cbnZhciBfQnVzeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9CdXN5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEdTdWJtaXQgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKEdTdWJtaXQsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gR1N1Ym1pdChwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBHU3VibWl0KTtcblxuICAgICAgICB2YXIgX3RoaXMgPSAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChHU3VibWl0Ll9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShHU3VibWl0KSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgc2hha2U6IGZhbHNlLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IF90aGlzLnByb3BzLmRpc2FibGVkLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBfdGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgXCJcIixcbiAgICAgICAgICAgIGJ1c3k6IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEdTdWJtaXQsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIC8vIGRpc2FibGVkXG4gICAgICAgICAgICBpZiAoISFuZXh0UHJvcHMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGlzYWJsZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkaXNhYmxlZDogZmFsc2UgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNoYWtlXG4gICAgICAgICAgICBpZiAobmV4dFByb3BzLnNoYWtlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNoYWtlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hha2U6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBidXN5XG4gICAgICAgICAgICBpZiAobmV4dFByb3BzLmJ1c3kpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYnVzeTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJ1c3k6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjbGFzc05hbWVcbiAgICAgICAgICAgIGlmICghIW5leHRQcm9wcy5jbGFzc05hbWUgJiYgbmV4dFByb3BzLmNsYXNzTmFtZSAhPSB0aGlzLnN0YXRlLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjbGFzc05hbWU6IG5leHRQcm9wcy5jbGFzc05hbWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG5cbiAgICAgICAgICAgIHZhciBodG1sID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGJ1dHRvbiBzaGFrZXMgc3RvcCBpdCFcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNoYWtlKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaGFrZTogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgd2UgYXJlIG5vdCBidXN5IHNob3cgdGhlIGJ1dHRvblxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmJ1c3kpIHtcbiAgICAgICAgICAgICAgICBodG1sID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdzdWJtaXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0blwiICsgKFwiIFwiICsgdGhpcy5zdGF0ZS5jbGFzc05hbWUgfHwgXCJcIikgKyAodGhpcy5zdGF0ZS5zaGFrZSA/IFwiIGJ0bi1hbmltYXRlLXNoYWtlXCIgOiBcIiBcIilcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIHNob3cgdGhlIGJ1c3kgYnV0dG9uXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHR5cGU6ICdzdWJtaXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG5cIiArIChcIiBcIiArIHRoaXMuc3RhdGUuY2xhc3NOYW1lIHx8IFwiXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0J1c3kyLmRlZmF1bHQsIG51bGwpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaHRtbDtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gR1N1Ym1pdDtcbn0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuICAgIHJldHVybiB7fTtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9yZWFjdFJlZHV4LmNvbm5lY3QpKG1hcFN0YXRlVG9Qcm9wcywge30pKEdTdWJtaXQpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZSgncmVhY3QtdHJhbnNpdGlvbi1ncm91cC9DU1NUcmFuc2l0aW9uR3JvdXAnKTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ1NTVHJhbnNpdGlvbkdyb3VwKTtcblxudmFyIF9mb3Jtc3lSZWFjdCA9IHJlcXVpcmUoJ2Zvcm1zeS1yZWFjdCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR1RleHRBcmVhID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShHVGV4dEFyZWEsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gR1RleHRBcmVhKHByb3BzKSB7XG4gICAgICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szLmRlZmF1bHQpKHRoaXMsIEdUZXh0QXJlYSk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoR1RleHRBcmVhLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShHVGV4dEFyZWEpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBibHVycmVkOiBmYWxzZSxcbiAgICAgICAgICAgIGRpcnR5OiBmYWxzZSxcbiAgICAgICAgICAgIG5hbWU6IF90aGlzLnByb3BzLm5hbWUgfHwgXCJcIlxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5jaGFuZ2VWYWx1ZSA9IF90aGlzLmNoYW5nZVZhbHVlLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5oYW5kZWxCbHVyID0gX3RoaXMuaGFuZGVsQmx1ci5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuZW5hYmxlU3VibWl0QnV0dG9uID0gX3RoaXMuY2hhbmdlVmFsdWUuYmluZChfdGhpcyk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShHVGV4dEFyZWEsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIGlmICghIW5leHRQcm9wcy5kaXJ0eSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkaXJ0eTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCEhbmV4dFByb3BzLm5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmFtZTogbmV4dFByb3BzLm5hbWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NoYW5nZVZhbHVlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZVZhbHVlKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnNldFZhbHVlKGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgaWYgKCEhdGhpcy5wcm9wcy5vbkNoYW5nZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdoYW5kZWxCbHVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRlbEJsdXIoKSB7XG4gICAgICAgICAgICBpZiAoISF0aGlzLnByb3BzLmdldFZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYmx1cnJlZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJsdXJyZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMucHJvcHMuc2hvd1JlcXVpcmVkKCkgPyAnZy1pbnB1dC1yZXF1aXJlZCcgOiB0aGlzLnByb3BzLnNob3dFcnJvcigpID8gJ2ctaW5wdXQtcmVxdWlyZWQnIDogbnVsbDtcblxuICAgICAgICAgICAgLy8gQW4gZXJyb3IgbWVzc2FnZSBpcyByZXR1cm5lZCBPTkxZIGlmIHRoZSBjb21wb25lbnQgaXMgaW52YWxpZFxuICAgICAgICAgICAgLy8gb3IgdGhlIHNlcnZlciBoYXMgcmV0dXJuZWQgYW4gZXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgdmFyIGVycm9yTWVzc2FnZSA9IFtdO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuYmx1cnJlZCAmJiB0aGlzLnByb3BzLmdldEVycm9yTWVzc2FnZSgpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gdGhpcy5wcm9wcy5nZXRFcnJvck1lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5kaXJ0eSAmJiB0aGlzLnByb3BzLnNob3dSZXF1aXJlZCgpKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gXCIqUmVxdWlyZWRcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBcImctY29udGFpbmVyLWNvbCBnLWlucHV0IFwiICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lIHx8IFwiXCIpIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAgICAgICAgIHsgaHRtbEZvcjogdGhpcy5zdGF0ZS5uYW1lIH0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgX0NTU1RyYW5zaXRpb25Hcm91cDIuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHJhbnNpdGlvbk5hbWU6ICdnLWlucHV0LWVycm9yLW1lc3NhZ2UtYW5pbWF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ6IDUwMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlICE9IFwiXCIgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWlucHV0LWVycm9yLW1lc3NhZ2UnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnLCB7IHR5cGU6IHRoaXMucHJvcHMudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5wcm9wcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdGhpcy5jaGFuZ2VWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgb25CbHVyOiB0aGlzLmhhbmRlbEJsdXIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnByb3BzLmdldFZhbHVlKCkgfHwgJydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gR1RleHRBcmVhO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9mb3Jtc3lSZWFjdC5IT0MpKEdUZXh0QXJlYSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucnVuID0gcnVuO1xuZXhwb3J0cy5nZXRTdG9yZSA9IGdldFN0b3JlO1xuZXhwb3J0cy5pbmplY3RNb2R1bGUgPSBpbmplY3RNb2R1bGU7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdERvbSA9IHJlcXVpcmUoJ3JlYWN0LWRvbScpO1xuXG52YXIgX3NhZ2FzID0gcmVxdWlyZSgnLi9zYWdhcy9zYWdhcycpO1xuXG52YXIgX3JvdXRlcyA9IHJlcXVpcmUoJy4vcm91dGVyL3JvdXRlcycpO1xuXG52YXIgX3JlZHVjZXJzID0gcmVxdWlyZSgnLi9yZWR1Y2Vycy9yZWR1Y2VycycpO1xuXG52YXIgX3JlYWN0Um91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbnZhciBfcmVhY3RSb3V0ZXJSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlci1yZWR1eCcpO1xuXG52YXIgX2NvbmZpZ3VyZVN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZS9jb25maWd1cmVTdG9yZScpO1xuXG52YXIgX2NvbmZpZ3VyZVN0b3JlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbmZpZ3VyZVN0b3JlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHN0b3JlID0gbnVsbDtcbnZhciBoaXN0b3J5ID0gbnVsbDtcbnZhciByb3V0ZXMgPSBudWxsO1xuXG4vLyByZWd1bGFyIHJlbmRlclxuZnVuY3Rpb24gcnVuKCkge1xuICAgIC8vIGluaXQgc3RvcmUsIHNhZ2FzLCBoaXN0b3J5LCBhbmQgcm91dGVzXG4gICAgc3RvcmUgPSAoMCwgX2NvbmZpZ3VyZVN0b3JlMi5kZWZhdWx0KSh3aW5kb3cuX19JTklUSUFMX1NUQVRFX18sICgwLCBfcmVkdWNlcnMucm9vdFJlZHVjZXIpKCkpO1xuICAgIHN0b3JlLnJ1blNhZ2EoKDAsIF9zYWdhcy5yb290U2FnYSkoKSwgc3RvcmUuZGlzcGF0Y2gpO1xuICAgIGhpc3RvcnkgPSAoMCwgX3JlYWN0Um91dGVyUmVkdXguc3luY0hpc3RvcnlXaXRoU3RvcmUpKF9yZWFjdFJvdXRlci5icm93c2VySGlzdG9yeSwgc3RvcmUpO1xuICAgIHJvdXRlcyA9ICgwLCBfcm91dGVzLnJlZ2lzdGVyZWRSb3V0ZXMpKCk7XG5cbiAgICAvLyByZW5kZXIgb3V0IGRvY1xuICAgICgwLCBfcmVhY3REb20ucmVuZGVyKShfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgX3JlYWN0UmVkdXguUHJvdmlkZXIsXG4gICAgICAgIHsgc3RvcmU6IHN0b3JlIH0sXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdFJvdXRlci5Sb3V0ZXIsIHsgb25VcGRhdGU6IGZ1bmN0aW9uIG9uVXBkYXRlKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgICAgICAgICB9LCBoaXN0b3J5OiBoaXN0b3J5LCByb3V0ZXM6IHJvdXRlcyB9KVxuICAgICksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7XG59XG5cbmZ1bmN0aW9uIGdldFN0b3JlKCkge1xuICAgIHJldHVybiBzdG9yZTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0TW9kdWxlKGEpIHtcbiAgICAoMCwgX3NhZ2FzLmluamVjdFNhZ2FzKShhLnNhZ2FzKTtcbiAgICAoMCwgX3JvdXRlcy5pbmplY3RSb3V0ZXMpKGEucm91dGVzKTtcbiAgICAoMCwgX3JlZHVjZXJzLmluamVjdFJlZHVjZXJzKShhLnJlZHVjZXJzKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9kZWZpbmVQcm9wZXJ0eScpO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZVByb3BlcnR5Mik7XG5cbnZhciBfZXh0ZW5kczUgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvZXh0ZW5kcycpO1xuXG52YXIgX2V4dGVuZHM2ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXh0ZW5kczUpO1xuXG52YXIgX3JlZHV4ID0gcmVxdWlyZSgncmVkdXgnKTtcblxudmFyIF9hcGlSZXF1ZXN0QWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvYXBpUmVxdWVzdEFjdGlvbnMnKTtcblxudmFyIGFjdGlvbnMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfYXBpUmVxdWVzdEFjdGlvbnMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBhcGlSZXF1ZXN0UmVkdWNlcigpIHtcbiAgICB2YXIgc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cbiAgICB2YXIga2V5ID0gYWN0aW9uLmtleTtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgYWN0aW9ucy5SRVFVRVNUOlxuICAgICAgICAgICAgcmV0dXJuICgwLCBfZXh0ZW5kczYuZGVmYXVsdCkoe30sIHN0YXRlLCAoMCwgX2RlZmluZVByb3BlcnR5My5kZWZhdWx0KSh7fSwga2V5LCAoMCwgX2V4dGVuZHM2LmRlZmF1bHQpKHt9LCBzdGF0ZVtrZXldLCB7XG4gICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVxdWVzdGVkQXQ6IGFjdGlvbi5yZXF1ZXN0ZWRBdFxuICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgY2FzZSBhY3Rpb25zLlNVQ0NFU1M6XG4gICAgICAgICAgICByZXR1cm4gKDAsIF9leHRlbmRzNi5kZWZhdWx0KSh7fSwgc3RhdGUsICgwLCBfZGVmaW5lUHJvcGVydHkzLmRlZmF1bHQpKHt9LCBrZXksICgwLCBfZXh0ZW5kczYuZGVmYXVsdCkoe30sIHN0YXRlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4gICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWRBdDogYWN0aW9uLnJlY2VpdmVkQXQsXG4gICAgICAgICAgICAgICAgZGF0YTogYWN0aW9uLmRhdGFcbiAgICAgICAgICAgIH0pKSk7XG4gICAgICAgIGNhc2UgYWN0aW9ucy5GQUlMVVJFOlxuICAgICAgICAgICAgcmV0dXJuICgwLCBfZXh0ZW5kczYuZGVmYXVsdCkoe30sIHN0YXRlLCAoMCwgX2RlZmluZVByb3BlcnR5My5kZWZhdWx0KSh7fSwga2V5LCAoMCwgX2V4dGVuZHM2LmRlZmF1bHQpKHt9LCBzdGF0ZVtrZXldLCB7XG4gICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkQXQ6IGFjdGlvbi5yZWNlaXZlZEF0LFxuICAgICAgICAgICAgICAgIGVycjogYWN0aW9uLmVyclxuICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgY2FzZSBhY3Rpb25zLlBVUkdFOlxuICAgICAgICAgICAgdmFyIHMgPSAoMCwgX2V4dGVuZHM2LmRlZmF1bHQpKHt9LCBzdGF0ZSk7XG4gICAgICAgICAgICBkZWxldGUgc1trZXldO1xuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuXG52YXIgYXBpUmVxdWVzdFJlZHVjZXJzID0gKDAsIF9yZWR1eC5jb21iaW5lUmVkdWNlcnMpKHtcbiAgICByZXF1ZXN0OiBhcGlSZXF1ZXN0UmVkdWNlclxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGFwaVJlcXVlc3RSZWR1Y2VycztcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2V4dGVuZHMnKTtcblxudmFyIF9leHRlbmRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4dGVuZHMyKTtcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2Fzc2lnbicpO1xuXG52YXIgX2Fzc2lnbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hc3NpZ24pO1xuXG5leHBvcnRzLmluamVjdFJlZHVjZXJzID0gaW5qZWN0UmVkdWNlcnM7XG5leHBvcnRzLnJvb3RSZWR1Y2VyID0gcm9vdFJlZHVjZXI7XG5cbnZhciBfcmVhY3RSb3V0ZXJSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlci1yZWR1eCcpO1xuXG52YXIgX3JlZHV4ID0gcmVxdWlyZSgncmVkdXgnKTtcblxudmFyIF9hcGlSZXF1ZXN0UmVkdWNlcnMgPSByZXF1aXJlKCcuL2FwaVJlcXVlc3RSZWR1Y2VycycpO1xuXG52YXIgX2FwaVJlcXVlc3RSZWR1Y2VyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hcGlSZXF1ZXN0UmVkdWNlcnMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaW5qZWN0ZWRSZWR1Y2VycyA9IHt9O1xuXG5mdW5jdGlvbiBpbmplY3RSZWR1Y2VycyhyKSB7XG4gICAgaW5qZWN0ZWRSZWR1Y2VycyA9ICgwLCBfYXNzaWduMi5kZWZhdWx0KSh7fSwgciwgaW5qZWN0ZWRSZWR1Y2Vycyk7XG59XG5cbmZ1bmN0aW9uIHJvb3RSZWR1Y2VyKCkge1xuICAgIHJldHVybiAoMCwgX3JlZHV4LmNvbWJpbmVSZWR1Y2VycykoKDAsIF9leHRlbmRzMy5kZWZhdWx0KSh7XG4gICAgICAgIGFwaTogX2FwaVJlcXVlc3RSZWR1Y2VyczIuZGVmYXVsdFxuICAgIH0sIGluamVjdGVkUmVkdWNlcnMsIHtcbiAgICAgICAgcm91dGluZzogX3JlYWN0Um91dGVyUmVkdXgucm91dGVyUmVkdWNlclxuICAgIH0pKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5pbmplY3RSb3V0ZXMgPSBpbmplY3RSb3V0ZXM7XG5leHBvcnRzLnJlZ2lzdGVyZWRSb3V0ZXMgPSByZWdpc3RlcmVkUm91dGVzO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxudmFyIF9iYXNlX3RtcGwgPSByZXF1aXJlKCcuLi9iYXNlX3RtcGwnKTtcblxudmFyIF9iYXNlX3RtcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYmFzZV90bXBsKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGluamVjdGVkUm91dGVzID0gW107XG52YXIgcm91dGVzID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgX3JlYWN0Um91dGVyLlJvdXRlLFxuICAgIHsgY29tcG9uZW50OiBfYmFzZV90bXBsMi5kZWZhdWx0IH0sXG4gICAgaW5qZWN0ZWRSb3V0ZXNcbik7XG5cbmZ1bmN0aW9uIGluamVjdFJvdXRlcyhyKSB7XG4gICAgaW5qZWN0ZWRSb3V0ZXMucHVzaChyKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJlZFJvdXRlcygpIHtcbiAgICByZXR1cm4gcm91dGVzO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVnZW5lcmF0b3IgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yJyk7XG5cbnZhciBfcmVnZW5lcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVnZW5lcmF0b3IpO1xuXG5leHBvcnRzLnJvb3RTYWdhID0gcm9vdFNhZ2E7XG5leHBvcnRzLmluamVjdFNhZ2FzID0gaW5qZWN0U2FnYXM7XG5cbnZhciBfZWZmZWN0cyA9IHJlcXVpcmUoJ3JlZHV4LXNhZ2EvZWZmZWN0cycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaW5qZWN0ZWRTYWdhcyA9IFtdO1xuXG5mdW5jdGlvbiByb290U2FnYSgpIHtcbiAgICByZXR1cm4gKC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3IyLmRlZmF1bHQubWFyayhmdW5jdGlvbiBfY2FsbGVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9yZWdlbmVyYXRvcjIuZGVmYXVsdC53cmFwKGZ1bmN0aW9uIF9jYWxsZWUkKF9jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXS5jb25jYXQoaW5qZWN0ZWRTYWdhcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIF9jYWxsZWUsIHRoaXMpO1xuICAgICAgICB9KVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGluamVjdFNhZ2FzKHMpIHtcbiAgICBpbmplY3RlZFNhZ2FzLnB1c2goKDAsIF9lZmZlY3RzLmZvcmspKHMpKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5FTkRQT0lOVFMgPSBleHBvcnRzLlVTRVJfREFUQV9TVE9SQUdFX0tFWSA9IGV4cG9ydHMuREVWSUNFX1RPS0VOX0hFQURFUiA9IGV4cG9ydHMuQVVUSF9UT0tFTl9IRUFERVIgPSB1bmRlZmluZWQ7XG5cbnZhciBfc3RyaW5naWZ5ID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5Jyk7XG5cbnZhciBfc3RyaW5naWZ5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ2lmeSk7XG5cbnZhciBfcHJvbWlzZSA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlJyk7XG5cbnZhciBfcHJvbWlzZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9taXNlKTtcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2Fzc2lnbicpO1xuXG52YXIgX2Fzc2lnbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hc3NpZ24pO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjaycpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzQ2FsbENoZWNrMik7XG5cbnZhciBfY3JlYXRlQ2xhc3MyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJyk7XG5cbnZhciBfY3JlYXRlQ2xhc3MzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2xhc3MyKTtcblxuZXhwb3J0cy5HZXQgPSBHZXQ7XG5leHBvcnRzLlBvc3QgPSBQb3N0O1xuZXhwb3J0cy5QdXQgPSBQdXQ7XG5leHBvcnRzLkRlbGV0ZSA9IERlbGV0ZTtcblxudmFyIF9pc29tb3JwaGljRmV0Y2ggPSByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoJyk7XG5cbnZhciBfaXNvbW9ycGhpY0ZldGNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzb21vcnBoaWNGZXRjaCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBBVVRIX1RPS0VOX0hFQURFUiA9IGV4cG9ydHMuQVVUSF9UT0tFTl9IRUFERVIgPSAnWC1BdXRoLVRva2VuJztcbnZhciBERVZJQ0VfVE9LRU5fSEVBREVSID0gZXhwb3J0cy5ERVZJQ0VfVE9LRU5fSEVBREVSID0gJ1gtRGV2aWNlLVRva2VuJztcbnZhciBVU0VSX0RBVEFfU1RPUkFHRV9LRVkgPSBleHBvcnRzLlVTRVJfREFUQV9TVE9SQUdFX0tFWSA9ICdVU0VSX0RBVEFfU1RPUkFHRV9LRVknO1xudmFyIEVORFBPSU5UUyA9IGV4cG9ydHMuRU5EUE9JTlRTID0ge1xuICAgIGxvZ2luOiBcIi9hcGkvbG9naW5cIlxufTtcblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH0sXG4gICAgbW9kZTogJ2NvcnMnLFxuICAgIGNhY2hlOiAnZGVmYXVsdCcsXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBib2R5OiBudWxsXG59O1xuXG52YXIgQXBpID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFwaSh1cmwpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBBcGkpO1xuXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSAoMCwgX2Fzc2lnbjIuZGVmYXVsdCkoZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIGFkZCBhdXRoIGhlYWRlcnMgaWYgdGhleSBhcmUgcHJlc2VudFxuICAgICAgICBpZiAoISFzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKEFVVEhfVE9LRU5fSEVBREVSKSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlcnNbQVVUSF9UT0tFTl9IRUFERVJdID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShBVVRIX1RPS0VOX0hFQURFUik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShERVZJQ0VfVE9LRU5fSEVBREVSKSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlcnNbREVWSUNFX1RPS0VOX0hFQURFUl0gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKERFVklDRV9UT0tFTl9IRUFERVIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mZXRjaCA9IF9pc29tb3JwaGljRmV0Y2gyLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoQXBpLCBbe1xuICAgICAgICBrZXk6ICdjYWxsQXBpJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNhbGxBcGkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh0aGlzLnVybCwgdGhpcy5vcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1cyA+PSAyMDAgJiYgcmVzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSByZWNlaXZlIGFuIGF1dGggdG9rZW4gd2Ugc2hvdWxkIGFkZCB0aGlzIHRvIHRoZSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuaGVhZGVycy5oYXMoQVVUSF9UT0tFTl9IRUFERVIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEFVVEhfVE9LRU5fSEVBREVSLCByZXMuaGVhZGVycy5nZXQoQVVUSF9UT0tFTl9IRUFERVIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSByZWNlaXZlIGEgZGV2aWNlIHRva2VuIHdlIHNob3VsZCBhZGQgdGhpcyB0byB0aGUgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmhlYWRlcnMuaGFzKERFVklDRV9UT0tFTl9IRUFERVIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKERFVklDRV9UT0tFTl9IRUFERVIsIHJlcy5oZWFkZXJzLmdldChERVZJQ0VfVE9LRU5fSEVBREVSKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oKS50aGVuKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHJlcy5zdGF0dXMsIGpzb246IGpzb24gfTtcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogcmVzLnN0YXR1cyB9OyAvLyBub3QgcmVhbGx5IGFuIGVycm9yLiBJZiByZXF1ZXN0IHdhc24ndCBhIGpzb24gcmVxdWVzdCB0aGVuIHNraXBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IHRvIGdldCBlcnJvciBtZXNzYWdlIGZyb20ganNvblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oKS50aGVuKGZ1bmN0aW9uIChqc29uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3Byb21pc2UyLmRlZmF1bHQucmVqZWN0KHsgc3RhdHVzOiByZXMuc3RhdHVzLCBqc29uOiBqc29uIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChlLnN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKEFVVEhfVE9LRU5fSEVBREVSKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9wcm9taXNlMi5kZWZhdWx0LnJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3Byb21pc2UyLmRlZmF1bHQucmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gICAgICAgICAvLyB0b2RvIHRoZW4gd2UgbmVlZCB0byBhZGQgYSBzdWNjZXNzIGhhbmRsZXIgdG8gdGhlIGNvbnRhY3QgZm9ybSBzbyB0aGF0IHBlb3BsZSBvbmx5IHN1Ym1pdCBvbmNlXG4gICAgICAgICAgICAvLyAgICAgICAgIC8vIHRvZG8gdGhlbiB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgZm9ybXMgdG8gYWxsb3cgZm9yIHN1Yml0IGFuZCBlcnJvciBhcyBhcHBvc2VkIHRvIGp1c3QgYSBkaXNhYmxlZCBidG5cbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcmVzOiByZXMgfTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAvL2ZhaWxcbiAgICAgICAgICAgICAgICByZXR1cm4geyBlcnI6IGVyciB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEFwaTtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gQXBpO1xuZnVuY3Rpb24gR2V0KHVybCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIG9wdGlvbnMubWV0aG9kID0gXCJHRVRcIjtcbiAgICByZXR1cm4gbmV3IEFwaSh1cmwsIG9wdGlvbnMpLmNhbGxBcGkoKTtcbn1cblxuZnVuY3Rpb24gUG9zdCh1cmwsIGJvZHkpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgICBvcHRpb25zLm1ldGhvZCA9IFwiUE9TVFwiO1xuXG4gICAgLy8gc3RyaW5naWZ5IGJvZHkgaWYgbmVlZGVkXG4gICAgaWYgKCEhYm9keSkge1xuICAgICAgICBvcHRpb25zLmJvZHkgPSAoMCwgX3N0cmluZ2lmeTIuZGVmYXVsdCkoYm9keSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQXBpKHVybCwgb3B0aW9ucykuY2FsbEFwaSgpO1xufVxuXG5mdW5jdGlvbiBQdXQodXJsLCBib2R5KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gICAgb3B0aW9ucy5tZXRob2QgPSBcIlBVVFwiO1xuXG4gICAgLy8gc3RyaW5naWZ5IGJvZHkgaWYgbmVlZGVkXG4gICAgaWYgKCEhYm9keSkge1xuICAgICAgICBvcHRpb25zLmJvZHkgPSAoMCwgX3N0cmluZ2lmeTIuZGVmYXVsdCkoYm9keSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQXBpKHVybCwgb3B0aW9ucykuY2FsbEFwaSgpO1xufVxuXG5mdW5jdGlvbiBEZWxldGUodXJsKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgb3B0aW9ucy5tZXRob2QgPSBcIkRlbGV0ZVwiO1xuICAgIHJldHVybiBuZXcgQXBpKHVybCwgb3B0aW9ucykuY2FsbEFwaSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjb25maWd1cmVTdG9yZTtcblxudmFyIF9yZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XG5cbnZhciBfcmVkdXhMb2dnZXIgPSByZXF1aXJlKCdyZWR1eC1sb2dnZXInKTtcblxudmFyIF9yZWR1eFNhZ2EgPSByZXF1aXJlKCdyZWR1eC1zYWdhJyk7XG5cbnZhciBfcmVkdXhTYWdhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4U2FnYSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZVN0b3JlKGluaXRpYWxTdGF0ZSwgcm9vdFJlZHVjZXIpIHtcblxuICAgIHZhciBzYWdhTWlkZGxld2FyZSA9ICgwLCBfcmVkdXhTYWdhMi5kZWZhdWx0KSgpO1xuICAgIHZhciBsb2dnZXIgPSAoMCwgX3JlZHV4TG9nZ2VyLmNyZWF0ZUxvZ2dlcikoe1xuICAgICAgICBjb2xsYXBzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHZhciBjb21wb3NlRW5oYW5jZXJzID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyB8fCBfcmVkdXguY29tcG9zZTtcbiAgICB2YXIgc3RvcmUgPSAoMCwgX3JlZHV4LmNyZWF0ZVN0b3JlKShyb290UmVkdWNlciwgaW5pdGlhbFN0YXRlLCBjb21wb3NlRW5oYW5jZXJzKCgwLCBfcmVkdXguYXBwbHlNaWRkbGV3YXJlKShzYWdhTWlkZGxld2FyZSwgbG9nZ2VyKSkpO1xuXG4gICAgc3RvcmUucnVuU2FnYSA9IHNhZ2FNaWRkbGV3YXJlLnJ1bjtcbiAgICBzdG9yZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JlLmRpc3BhdGNoKF9yZWR1eFNhZ2EuRU5EKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHN0b3JlO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJ1biA9IHJ1bjtcbmZ1bmN0aW9uIHJ1bih3aXRoQWRtaW4sIGFjdGl2ZVBsdWdpbnMsIGFjdGl2ZUFkbWluUGx1Z2lucywgYWN0aXZlVGhlbWUpIHtcblxuICAgIC8vIGZpcnN0IGdldCBnb0NNUyBiYXNlXG4gICAgdmFyIGdvQ01TQmFzZSA9IHJlcXVpcmUoJy4vYmFzZS9pbml0LmpzJyk7XG5cbiAgICBpZiAoISF3aW5kb3cuTVNJbnB1dE1ldGhvZENvbnRleHQgJiYgISFkb2N1bWVudC5kb2N1bWVudE1vZGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJRTExOiBMb2FkaW5nIHByb21pc2UgcG9seWZpbGxcIik7XG4gICAgICAgIHJlcXVpcmUoJ2VzNi1wcm9taXNlJykucG9seWZpbGwoKTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayB0byBzZWUgaWYgd2UgYXJlIGxvYWRpbmcgYWRtaW4gc2VjdGlvblxuICAgIGlmICghIXdpdGhBZG1pbikge1xuICAgICAgICB2YXIgZ29DTVNBZG1pbiA9IHJlcXVpcmUoJy4vYWRtaW4vaW5pdC5qcycpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdGl2ZUFkbWluUGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFjdGl2ZUFkbWluUGx1Z2luSW5pdCA9IGFjdGl2ZUFkbWluUGx1Z2luc1tpXSArIFwiL2FkbWluL2NvbmZpZy9pbml0LmpzXCI7XG4gICAgICAgICAgICB2YXIgYWN0aXZlQWRtaW5QbHVnaW4gPSByZXF1aXJlKGFjdGl2ZUFkbWluUGx1Z2luSW5pdCkuZGVmYXVsdDtcbiAgICAgICAgICAgIGdvQ01TQWRtaW4uaW5qZWN0TW9kdWxlKGFjdGl2ZUFkbWluUGx1Z2luKTtcbiAgICAgICAgfVxuICAgICAgICBnb0NNU0Jhc2UuaW5qZWN0TW9kdWxlKGdvQ01TQWRtaW4uZ2V0TW9kdWxlKCkpO1xuICAgIH1cblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhY3RpdmVQbHVnaW5zLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgYWN0aXZlUGx1Z2luSW5pdCA9IGFjdGl2ZVBsdWdpbnNbX2ldICsgXCIvcHVibGljL2NvbmZpZy9pbml0LmpzXCI7XG4gICAgICAgIHZhciBhY3RpdmVQbHVnaW4gPSByZXF1aXJlKGFjdGl2ZVBsdWdpbkluaXQpLmRlZmF1bHQ7XG4gICAgICAgIGdvQ01TQmFzZS5pbmplY3RNb2R1bGUoYWN0aXZlUGx1Z2luKTtcbiAgICB9XG5cbiAgICAvLyBsb2FkIHRoZSB0aGVtZVxuICAgIHZhciB0aGVtZUluaXQgPSBhY3RpdmVUaGVtZSArICcvdGhlbWUvY29uZmlnL2luaXQuanMnO1xuICAgIHZhciBnb0NNU1RoZW1lID0gcmVxdWlyZSh0aGVtZUluaXQpLmRlZmF1bHQ7XG4gICAgZ29DTVNCYXNlLmluamVjdE1vZHVsZShnb0NNU1RoZW1lKTtcblxuICAgIC8vIHJ1biB0aGUgY21zXG4gICAgZ29DTVNCYXNlLnJ1bigpO1xufVxuIl19