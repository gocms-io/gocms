'use strict';

import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import {connect} from 'react-redux'



class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    componentWillMount() {
    }

    componentDidMount() {
    }


    render() {

        return (
          <h1>dashboard</h1>
        );
    }

}


function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {
})(DashboardPage);