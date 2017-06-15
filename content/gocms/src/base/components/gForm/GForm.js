'use strict';

import React from 'react';
import {connect} from 'react-redux'
import Formsy from 'formsy-react';
import GSubmit from './GSubmit'


class GForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitButtonIsDisabled: true,
            submitBtnClassName: this.props.submitBtnClassName || ""
        };
        this.handleSubmit = this.handleSubmit.bind(this); //bind function once
        this.disableSubmitButton = this.disableSubmitButton.bind(this); //bind function once
        this.enableSubmitButton = this.enableSubmitButton.bind(this); //bind function once

    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.submitBtnClassName && nextProps.submitBtnClassName != this.props.submitBtnClassName) {
            this.setState({submitBtnClassName: nextProps.submitBtnClassName})
        }
    }

    componentWillMount() {
    }


    componentDidMount() {
    }

    enableSubmitButton() {
        this.setState({submitButtonIsDisabled: false});
    }

    disableSubmitButton() {
        this.setState({submitButtonIsDisabled: true});

    }

    handleSubmit(model) {
        if (!!this.props.onSubmit) {
            this.props.onSubmit(model);
        }
    }


    render() {

        return (
            <Formsy.Form
                id={this.props.name}
                className={"gForm " + (this.props.className || "")}
                name={this.props.name}
                onSubmit={this.handleSubmit}
                onValid={this.enableSubmitButton}
                onInvalid={this.disableSubmitButton}
                formNoValidate>
                {this.props.children}
                {!this.props.submitBtn ? "" : <GSubmit type="submit" className={"btn btn-default " + (this.state.submitBtnClassName || "")} disabled={this.state.submitButtonIsDisabled}>{this.props.submitBtn}</GSubmit>}
            </Formsy.Form>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(GForm);