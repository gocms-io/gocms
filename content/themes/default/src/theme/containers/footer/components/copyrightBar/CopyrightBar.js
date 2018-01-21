'use strict';

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Copyright extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div className="container-fluid container-fluid-no-padding">
                <div className="footer-copyright-bar-wrapper">
                    <p className="footer-copyright-text hidden-xs hidden-sm">Copyright &copy; 2017 Big Steps Little Feet Inc. All Rights Reserved </p>
                    <p className="footer-copyright-text footer-copyright-text-mobile hidden-md hidden-lg">Copyright &copy; 2017 Big Feet Little Steps Inc. All Rights Reserved </p>
                </div>
            </div>
        );
    }


}

export default Copyright;