'use strict';

import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import {connect} from 'react-redux'
import {request} from '../../../base/actions/apiRequestActions';
import GForm from '../../../base/components/gForm/GForm'
import GInput from '../../../base/components/gForm/GInput'

const LOGIN_FORM = "LOGIN_FORM";


class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shake: false,
            errMessage: this.props.errMessage || null
        };
        this.handleSubmit = this.handleSubmit.bind(this); //bind function once
    }


    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.err && nextProps.reqTime != this.props.reqTime) {
            this.setState({shake: true})
        }
        if (!!nextProps.errMessage && nextProps.errMessage != this.state.errMessage) {
            this.setState({errMessage: nextProps.errMessage});
        }
    }

    handleSubmit(model) {
        this.props.request(LOGIN_FORM, model);
        this.setState({errMessage: null});
    }


    render() {
        // if the button shakes stop it!
        if (this.state.shake) {
            setTimeout(function () {
                this.setState({shake: false});
            }.bind(this), 1000);
        }

        return (
            <div className="g-a">
                <div id="container-login-page">
                    <div id="container-login-page-form" className="g-container-col">
                        <div className="wrapper-login-form" noValidate>
                            <div className="g-container-col">
                                <h1 className="text-center no-padding no-margin">{GOCMS_LOGIN_TITLE}</h1>
                                <GForm id="main-login-form" className="main-login-form" name="main-login-form" onSubmit={this.handleSubmit}
                                       submitBtn="Log In"
                                       submitBtnClassName={this.state.shake ? "btn-animate-shake" : " "}>
                                    <GInput id="email" name="email" type="text" label="Email" validations="isEmail"
                                            validationError="Please enter a valid email." required/>
                                    <GInput id="password" name="password" type="password" label="Password"
                                            required/>
                                </GForm>
                                <div className="g-col">
                                    <div className="error-message-login">
                                        <CSSTransitionGroup transitionName="g-error-message-box-login-animate"
                                                            transitionEnterTimeout={500}
                                                            transitionLeaveTimeout={500}>
                                            {!!this.state.errMessage ? <h3>{this.state.errMessage}</h3> : null}
                                        </CSSTransitionGroup>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


function mapStateToProps(state) {
    let errMessage;
    let err;
    let reqTime;
    let req = state.api.request[LOGIN_FORM];
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
        errMessage: errMessage,
    }
}

export default connect(mapStateToProps, {
    request
})(LoginPage);