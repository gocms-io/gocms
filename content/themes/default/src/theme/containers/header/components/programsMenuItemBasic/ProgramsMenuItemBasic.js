'use strict';

import React from 'react';
import {Link} from 'react-router';

class ProgramsMenuItemBasic extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }


    onClick(e) {
        this.props.onMenuItemSelected();
        // if mobile we need to close the main mobile menu
        if (this.props.mobile) {
            this.props.onClick();
        }
    }

    render() {

        return (
            <Link to={this.props.uri} onClick={this.onClick} className={this.props.mobile?"programs-menu-item-basic-mobile":""}>
                <h2 className="programs-menu-item-basic-title hover-animate-zoom"><span className="color-orange"> <i
                    className="icon-arrow-right programs-menu-item-basic-title-icon-padding"/></span>{this.props.title}
                </h2>
            </Link>
        );
    }


}

export default ProgramsMenuItemBasic;