'use strict';

import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import {connect} from 'react-redux'
import {gocms_login} from './loginPage.actions';
import GForm from '../../../base/components/gForm/GForm'
import GInput from '../../../base/components/gForm/GInput'
import GError from '../../../base/components/gForm/GError'

const LOGIN_FORM = "GOCMS_LOGIN_FORM";


class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shake: false
        };
        this.handleSubmit = this.handleSubmit.bind(this); //bind function once
    }


    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.err && nextProps.reqTime != this.props.reqTime) {
            this.setState({shake: true});
        }
        if (!!nextProps.errMessage && nextProps.errMessage != this.state.errMessage) {
            this.setState({errMessage: nextProps.errMessage});
        }
    }

    handleSubmit(model) {
        this.props.gocms_login(LOGIN_FORM, model);
        this.setState({errMessage: null});
    }


    render() {


        return (
            <div className="g-a">
                <div id="container-login-page">
                    <div id="container-login-page-form" className="g-container-col">
                        <div className="wrapper-login-form" noValidate>
                            <div className="g-container-col">
                                <h1 className="text-center no-padding no-margin">{GOCMS_LOGIN_TITLE}</h1>
                                <GForm id="main-login-form" className="main-login-form" name="main-login-form"
                                       onSubmit={this.handleSubmit}
                                       submitBtn="Log In"
                                       submitBtnClassName={"btn-default"}
                                       submitBtnShake={this.state.shake}>
                                    <GInput id="email" name="email" type="text" label="Email" validations="isEmail"
                                            validationError="Please enter a valid email." required/>
                                    <GInput id="password" name="password" type="password" label="Password"
                                            required/>
                                </GForm>
                                <div className="g-col">
                                    <GError
                                        className="error-message-login"
                                        errMessage={this.state.errMessage}
                                    />
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
    gocms_login
})(LoginPage);