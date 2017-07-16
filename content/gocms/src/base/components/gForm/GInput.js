import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import {HOC} from 'formsy-react';

class GInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blurred: false
        };
        this.changeValue = this.changeValue.bind(this);
        this.handelBlur = this.handelBlur.bind(this);
        this.enableSubmitButton = this.changeValue.bind(this);

    }

    changeValue(event) {
        this.props.setValue(event.currentTarget.value);
    }

    handelBlur() {
        if (!!this.props.getValue()) {
            this.setState({blurred: true})
        }
        else {
            this.setState({blurred: false})
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

        return (
            <div className={"g-container-col g-input " + (this.props.className || "")}>
                <label htmlFor={this.props.name}>{this.props.label}
                    <CSSTransitionGroup transitionName="g-input-error-message-animate"
                                        transitionEnterTimeout={500}
                                        transitionLeaveTimeout={500}>
                        {errorMessage != "" ? <span className="g-input-error-message">{errorMessage}</span> : null}
                    </CSSTransitionGroup>
                </label>
                <input type={this.props.type}
                       name={this.props.name}
                       onChange={this.changeValue}
                       onBlur={this.handelBlur}
                       value={this.props.getValue() || ''}
                />
            </div>
        );
    }

}
export default HOC(GInput);
