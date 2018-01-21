'use strict';

import React from 'react';
import {Link} from 'react-router'

class Logo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {


        return (
            <div className="logo">
                <Link to="/">
                    <img src="/themes/bslf/img/logo-sm.jpg" width="165" alt="logo"/>
                </Link>
            </div>
        );
    }


}

export default Logo;