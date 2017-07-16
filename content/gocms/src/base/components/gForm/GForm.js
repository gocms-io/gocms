'use strict';

import React from 'react';
import {connect} from 'react-redux'
import Formsy from 'formsy-react';
import GSubmit from './GSubmit'
import GInput from './GInput'
import GTextArea from './GTextArea'


class GForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitButtonIsDisabled: true,
            submitBtnClassName: this.props.submitBtnClassName || "",
            submitBtnShake: this.props.submitBtnShake,
            dirty: false
        };
        this.handleSubmit = this.handleSubmit.bind(this); //bind function once
        this.disableSubmitButton = this.disableSubmitButton.bind(this); //bind function once
        this.enableSubmitButton = this.enableSubmitButton.bind(this); //bind function once

    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.submitBtnClassName && nextProps.submitBtnClassName != this.props.submitBtnClassName) {
            this.setState({submitBtnClassName: nextProps.submitBtnClassName})
        }
        if (nextProps.submitBtnShake) {
            this.setState({
                submitBtnShake: true
            })
        }
        else {
            this.setState({
                submitBtnShake: false
            })
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
            // if button is "disabled" then don't allow form to submit. Instead show error.
            if (this.state.submitButtonIsDisabled) {

                this.setState({
                    submitBtnShake: true,
                    dirty: true
                });
                // rest button shake after 1 second
                setTimeout(function () {
                    this.setState({submitBtnShake: false});
                }.bind(this), 1000);


            }
            // otherwise submit
            else {
                this.props.onSubmit(model);
            }
        }
    }


    render() {
        let isDirty = this.state.dirty;
        let childrenWithProps = React.Children.map(this.props.children,
            function (child) {
                if (!!child) {
                    return React.cloneElement(child, {
                        dirty: isDirty,
                        key: child.props.key
                    });
                }
            }
        );

        return (
            <Formsy.Form
                id={this.props.name}
                className={"gForm " + (this.props.className || "")}
                name={this.props.name}
                onSubmit={this.handleSubmit}
                onValid={this.enableSubmitButton}
                onInvalid={this.disableSubmitButton}
                formNoValidate>
                {childrenWithProps}
                {!this.props.submitBtn ? "" :
                    <GSubmit type="submit" className={this.state.submitBtnClassName} shake={this.state.submitBtnShake}
                    >{this.props.submitBtn}</GSubmit>}
            </Formsy.Form>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(GForm);