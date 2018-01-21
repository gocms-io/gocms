'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'


class Accordion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className={"accordion-wrapper "+this.props.className}>
                {this.props.children}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(Accordion);