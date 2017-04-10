'use strict';

import React from 'react';
import {connect} from 'react-redux'
import HeroImage from '../heroImage/HeroImage'


class BasicComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <p className="basic-component">Basic Component</p>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(BasicComponent);