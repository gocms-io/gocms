'use strict';

import React from 'react';
import {Link} from 'react-router';

class NavigationItemBasic extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.classNameDefualt = props.mobile ? "navigation-item-mobile" : "navigation-item";
        this.className = this.classNameDefualt;
    }

    componentWillReceiveProps(nextProps) {
    }

    onClick(e) {
        // if desktop do some processing of event to handle menu correctly
        if (!this.props.mobile) {
            if (!!this.props.onClick) {
                e.stopPropagation();
                e.preventDefault();
                this.props.onClick(e);
            }
        }
        // else mobile and just pass on to root
        else {
            this.props.onClick(e);
        }
    }


    render() {

        let html = null;

        // mobile
        if (this.props.mobile) {
            if (this.props.pos == 0) {
                this.className = this.classNameDefualt + " navigation-item-mobile-first"
            }

            html =
                <Link to={this.props.uri} className={this.className} onClick={this.onClick}>
                    <i className="icon-arrow-down color-orange"/>
                    {this.props.title}
                </Link>

        }
        // desktop
        else {
            if (this.props.pos == 0) {
                this.className = this.classNameDefualt + " navigation-item-first"
            }

            html =
                <Link to={this.props.uri} className={this.className} onClick={this.onClick}>
                    {this.props.title}
                    <i className="icon-arrow-down color-orange"/>
                </Link>
        }


        return (html);
    }

}

export default NavigationItemBasic;