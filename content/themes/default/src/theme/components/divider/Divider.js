'use strict';

import React from 'react';
import {connect} from 'react-redux'


class Divider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="wrapper-divider">
                <div className="divider-line-break divider-line-break-left"/>
                <div className="divider-line-break divider-line-break-right"/>
                <div className="divider-circle-wrapper">
                    <div className="divider-circle-overlay"></div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(Divider);