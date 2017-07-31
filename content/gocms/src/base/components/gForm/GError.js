import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class GError extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errMessage: this.props.errMessage || null
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.errMessage) {
            this.setState({errMessage: nextProps.errMessage})
        }
    }

    render() {
        return (
                <div className={"g-error-message " + (this.props.className || "")}>
                    <CSSTransitionGroup transitionName="g-error-message-box-animate"
                                        transitionEnterTimeout={500}
                                        transitionLeaveTimeout={500}>
                        {!!this.state.errMessage ? <h3>{this.state.errMessage}</h3> : null}
                    </CSSTransitionGroup>
                </div>
        );
    }

}
export default GError;
