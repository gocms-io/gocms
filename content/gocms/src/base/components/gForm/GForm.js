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
            submitBtnBusy: false,
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

        // busy button
        if (nextProps.submitBtnBusy) {
            this.setState({
                submitBtnBusy: true
            })
        }
        else {
            this.setState({
                submitBtnBusy: false
            })
        }

        // shake button
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
                this.setState({submitBtnBusy: true});
            }
        }
    }

    recursiveCloneChildren(children) {
        return React.Children.map(children, child => {
                if (!React.isValidElement(child)) return child;
                let childProps = {};
                if (!!child.props.children) {
                    childProps.children = this.recursiveCloneChildren(child.props.children);
                }
                // if child is GInput add dirty prop
                if (child.type === GInput || child.type === GTextArea) {
                    childProps.dirty = this.state.dirty;
                    return React.cloneElement(child, childProps);
                }
                else {
                    return React.cloneElement(child, childProps);
                }
            }
        )
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
                {this.recursiveCloneChildren(this.props.children)}
                {!this.props.submitBtn ? "" :
                    <GSubmit type="submit" className={this.state.submitBtnClassName}
                             shake={this.state.submitBtnShake}
                             busy={this.state.submitBtnBusy}
                    >{this.props.submitBtn}</GSubmit>}
            </Formsy.Form>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(GForm);