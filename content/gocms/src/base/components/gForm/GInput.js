/**
 * This GoCMS input component supports these standard HTML form input features such as text,
 * number email and password. It also (optionally) supports:
 * - Checkboxes - Set the type to "checkbox" and pass an initial boolean value using the value property.
 *     Note that checkboxes always have a value so the required attribute does nothing.
 * - Datalists - Pass a list of legal values via the suggestedValues property.
 *     Note that HTML datalist don't require that the user choose on eof the suggested values.
 * - Attributes - Set the autoFocus or required attributes as in a standard HTML form.
 */
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import {HOC} from 'formsy-react';

class GInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blurred: false,
            dirty: false,
            name: this.props.name || ""
        };
        this.changeValue = this.changeValue.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.enableSubmitButton = this.changeValue.bind(this);
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

        // For checkboxes, invert the current value, otherwise just set the value.
        if (this.props.type === "checkbox") {
            this.props.setValue(!this.props.getValue());
        } else {
            this.props.setValue(event.currentTarget.value);
        }

        // Run the provided onChange() handler, if any.
        if (!!this.props.onChange) {
            this.props.onChange(event);
        }
    }

    handleBlur() {
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

    createUniqueDataListName() {
        // The input component just refer to the datalist by (unique) ID.
        return this.props.name + "Values";
    }

    generateDatalistOptions() {
        return(
            this.props.suggestedValues.map(
                (value, index) => {
                    return (
                        <option key={index} value={value} />
                    );
                }
            )
        );
    }

    createDataListIfAppropriate() {
        if (Array.isArray(this.props.suggestedValues) && this.props.suggestedValues.length > 0) {
            return (
                <datalist id={ this.createUniqueDataListName() }>
                    { this.generateDatalistOptions() }
                </datalist>
            );
        } else {
            return "";
        }
    }

    render() {
        const className = this.props.showRequired() ? 'g-input-required' : this.props.showError() ? 'g-input-error' : null;

        // An error message is returned ONLY if the component is invalid
        // or the server has returned an error message
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
                <input type={this.props.type}
                       name={this.state.name}
                       onChange={this.changeValue}
                       onBlur={this.handleBlur}
                       value={this.props.getValue() || ''}
                       list={this.createUniqueDataListName()}
                       checked={this.props.getValue()}
                       autoFocus={this.props.autoFocus}
                />
                { this.createDataListIfAppropriate() }
            </div>
        );
    }

}
export default HOC(GInput);
