'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'


class NewsEventItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <div {...this.props}>
                <div className="news-event-item-wrapper">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(NewsEventItem);