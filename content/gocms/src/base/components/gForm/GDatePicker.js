/**
 * This is a date-picking version of GInput based on the react-datepicker and MomentJS.
 * - Dates are initialized/stored using MomentJS format.
 * - Initialize the date using the value property; the component defaults to today.
 * - The user can manually edit the date value, but only legal dates will be stored/returned by the form.
 *     Entering illegal date formats will not overwrite the form's previous date value.
 */
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import PropTypes from 'prop-types';
import {HOC} from 'formsy-react';

import moment from 'moment';
import DatePicker from 'react-datepicker';

// TODO: Deliver this file to the running application somehow.
//import 'react-datepicker/dist/react-datepicker.css';

class GDatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blurred: false,
            dirty: false,
            name: this.props.name || "",
        };
        this.changeValue = this.changeValue.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    componentWillMount(){
        let initialDate;
        if (!!this.props.value) {
            initialDate = this.props.value;
        } else {
            initialDate = moment();
        }
        this.props.setValue(initialDate);
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.dirty ) {
            this.setState({dirty: true});
        }

        if (!!nextProps.name) {
            this.setState({name: nextProps.name});
        }
    }

    changeValue(date) {
        this.props.setValue(!!date ? date : "");
        if (!!this.props.onChange) {
            this.props.onChange(date);
        }
    }

    handleBlur(event) {
        if (!!this.props.getValue()) {
            this.setState({blurred: true})
        }
        else {
            this.setState({blurred: false})
        }
        if (!!this.props.onBlur) {
            this.props.onBlur(event);
        }
    }

    render() {
        const className = this.props.showRequired() ? 'g-input-required' : this.props.showError() ? 'g-input-error' : null;

        let errorMessage = [];
        if (this.state.blurred && this.props.getErrorMessage()) {
            errorMessage = this.props.getErrorMessage();
        }
        else if (this.state.dirty && this.props.showRequired()) {
            errorMessage = "*Required";
        }

        return (
            <div className={"g-container-col g-input " + (this.props.className || "")}>
                <label htmlFor={this.state.name}>{this.props.label}
                    <CSSTransitionGroup transitionName="g-input-error-message-animate"
                                        transitionEnterTimeout={500}
                                        transitionLeaveTimeout={500}>
                        {errorMessage != "" ? <span className="g-input-error-message">{errorMessage}</span> : null}
                    </CSSTransitionGroup>
                </label>
                <DatePicker
                    name={this.state.name}
                    selected={this.props.getValue()}
                    onChange={this.changeValue}
                    onBlur={this.handleBlur}
                    autoFocus={this.props.autoFocus}
                />
            </div>
        );

    }

}

export default HOC(GDatePicker);