'use strict';

import React from 'react';
import {connect} from 'react-redux'
import HeroImage from '../heroImage/HeroImage'


class CalloutBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className={'callout-box ' + (this.props.className || "")}>
                {this.props.children}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(CalloutBox);