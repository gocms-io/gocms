'use strict';

import React from 'react';
import {connect} from 'react-redux'
import HeroImage from '../heroImage/HeroImage'


class Navigation extends React.Component {
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
                <div className="divider-circle-wrapper">
                    <div className="divider-circle-overlay"></div>
                </div>
                <div className="divider-line-break divider-line-break-right"/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(Navigation);