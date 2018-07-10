/**
 * This GoCMS input component supports these standard HTML select field based on the following
 * properties.
 *  - legalValues - an array of value options (required)
 *      Note that a value of "" will fail the Formsy "required" test, so use it to indicate
 *      that the field is "unfilled".
 *  - presentationValues - an array of strings to present, one for each legal value (optional)
 *      Note that this array must match the size/order of legalValues.
 */
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {HOC} from 'formsy-react';

class GSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blurred: false,
            dirty: false,
            name: this.props.name || ""
        };
        this.changeValue = this.changeValue.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.generateDropdownOptions = this.generateDropdownOptions.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.dirty ) {
            this.setState({dirty: true});
        }

        if (!!nextProps.name) {
            this.setState({name: nextProps.name});
        }
    }

    changeValue(event) {
        this.props.setValue(event.currentTarget.value);
        if (!!this.props.onChange) {
            this.props.onChange(event);
        }
    }

    handleBlur() {
        if (!!this.props.getValue()) {
            this.setState({blurred: true});
        }
        else {
            this.setState({blurred: false});
        }
        if (!!this.props.onBlur) {
            this.props.onBlur(event);
        }
    }

    generateDropdownOptions() {
        if (!Array.isArray(this.props.legalValues)) {
            return [];
        } else {
            let result = [...this.props.legalValues];
            return (
                result.map(
                    (value, index) => {
                        return (
                            <option key={value} value={value}>
                                { this.props.presentationValues ? this.props.presentationValues[index] : value }
                            </option>
                        );
                    }
                )
            )
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
                <select className="dropdown"
                        name={this.props.name}
                        onChange={this.changeValue}
                        onBlur={this.handleBlur}
                        value={this.props.getValue() || ''}
                        autoFocus={ this.props.autoFocus }
                >
                    { this.generateDropdownOptions() }
                </select>
            </div>
        );
    }

}

export default HOC(GSelect);