'use strict';

import React from 'react';
import Divider from '../../components/divider/Divider'
import {connect} from 'react-redux'


class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>
                <h1>GoCMS Default Theme</h1>
                <Divider/>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {
})(HomePage);