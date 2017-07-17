'use strict';

import React from 'react';
import {connect} from 'react-redux'
import Busy from '../busy/Busy'


class GSubmit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shake: false,
            disabled: this.props.disabled,
            className: this.props.className || "",
            busy: false
        };

    }

    componentWillReceiveProps(nextProps) {
        // disabled
        if (!!nextProps.disabled) {
            this.setState({disabled: true});
        }
        else {
            this.setState({disabled: false});
        }

        // shake
        if (nextProps.shake) {
            this.setState({shake: true});
        }
        else {
            this.setState({shake: false});
        }

        // busy
        if (nextProps.busy) {
            this.setState({busy: true});
        }
        else {
            this.setState({busy: false});
        }

        // className
        if (!!nextProps.className && nextProps.className != this.state.className) {
            this.setState({className: nextProps.className});
        }
    }

    componentDidMount() {
    }


    render() {

        let html = null;

        // if the button shakes stop it!
        if (this.state.shake) {
            setTimeout(function () {
                this.setState({shake: false});
            }.bind(this), 1000);
        }

        // if we are not busy show the button
        if (!this.state.busy) {
            html =
                <button type="submit"
                        className={"btn" + (" " + this.state.className || "") + (this.state.shake ? " btn-animate-shake" : " ")}
                >
                    {this.props.children}
                </button>;
        }
        // else show the busy button
        else {
            html =
                <button type="submit"
                        className={"btn" + (" " + this.state.className || "")}
                        disabled
                >
                    <Busy/>
                </button>;
        }

        return (html);
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(GSubmit);