'use strict';

import React from 'react';
import {connect} from 'react-redux'
import MessageBar from './components/messageBar/MessageBar'
import Navigation from './components/navigation/Navigation'


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screenType: this.props.screenType
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.screenType !== this.state.screenType) {
            this.setState({screenType: nextProps.screenType});
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="wrapper-header">
                <MessageBar
                    message=""
                />
                <Navigation screenType={this.state.screenType}/>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(Header);