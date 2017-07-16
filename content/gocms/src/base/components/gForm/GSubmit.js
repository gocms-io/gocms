'use strict';

import React from 'react';
import {connect} from 'react-redux'


class GSubmit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

        if (!!nextProps.className && nextProps.className != this.state.className) {
            this.setState({className: nextProps.className});
        }
    }

    componentDidMount() {
    }


    render() {
        return (
            <button type="submit" className={"btn" + (this.state.disabled ? " btn-disabled" : "") + (" " + this.state.className || "")} disabled={this.state.disabled}>{this.props.children}</button>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(GSubmit);