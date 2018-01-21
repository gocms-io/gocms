'use strict';

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class MessageBar extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {
            show: true
        };
    }

    onClick(e) {
        e.stopPropagation();
        e.preventDefault();
        this.setState({show: !this.state.show})
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        let m = null;
        let style = {
            'minHeight': '35px',
        };
        if (!!this.props.message && this.state.show) {
            m =
                <div className="row-no-padding row-message-bar">
                    <div className="col-xs-10 col-sm-10 col-sm-push-1">
                        <p className="message-bar-message" dangerouslySetInnerHTML={this.props.message}/>
                    </div>
                    <div className="col-xs-2 col-sm-1 col-sm-push-1">
                        <button className="btn message-bar-close-btn" onClick={this.onClick}>x</button>
                    </div>
                </div>;
        }
        else {
            style = null;
        }
        return (
            <div className="container-fluid container-fluid-no-padding">
                <div className="container-message-bar" style={style}>
                    <ReactCSSTransitionGroup transitionName="message-bar"
                                             transitionAppear={true}
                                             transitionAppearTimeout={1500}
                                             transitionEnter={false}
                                             transitionLeave={true}
                                             transitionLeaveTimeout={300}>
                        {m}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }


}

export default MessageBar;