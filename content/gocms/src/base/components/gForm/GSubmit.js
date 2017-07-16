'use strict';

import React from 'react';
import {connect} from 'react-redux'


class GSubmit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shake: false,
            disabled: this.props.disabled,
            className: this.props.className || ""
        };

    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.disabled) {
            this.setState({disabled: true});
        }
        else {
            this.setState({disabled: false});
        }
        if (nextProps.shake) {
            this.setState({shake: true});
        }
        else {
            this.setState({shake: false});
        }

        if (!!nextProps.className && nextProps.className != this.state.className) {
            this.setState({className: nextProps.className});
        }
    }

    componentDidMount() {
    }


    render() {
        // if the button shakes stop it!
        if (this.state.shake) {
            setTimeout(function () {
                this.setState({shake: false});
            }.bind(this), 1000);
        }

        return (
            <button type="submit"
                    className={"btn" + (" " + this.state.className || "") + (this.state.shake ? " btn-animate-shake" : " ")}
            >
                {this.props.children}
            </button>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(GSubmit);