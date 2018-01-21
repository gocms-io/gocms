'use strict';

import React from 'react';
import Logo from '../logo/Logo'
import NavigationItemBasic from '../navigationItemBasic/NavigationItemBasic'
import NavigationItemPrograms from '../navigationItemPrograms/NavigationItemPrograms'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup' // ES6


class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);

        this.state = {
            open: false,
            screenType: props.screenType,
            mobile: props.screenType === "mobile"
        };
    }

    onClick(e) {
        // if not mobile we need to prevent default
        if (!this.state.mobile) {
            e.preventDefault();
        }
        this.setState({open: !this.state.open});
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.screenType !== this.state.screenType) {
            this.setState({
                screenType: nextProps.screenType,
                mobile: nextProps.screenType === "mobile"
            });
        }
    }


    render() {

        let navigation = null;
        let navigationMobileDropDown = null;

        if (this.state.mobile) {
            let menuText = this.state.open ? "CLOSE" : "MENU";
            let menuIcon = this.state.open ? "icon-menu-close" : "icon-menu";


            if (this.state.open) {
                navigationMobileDropDown =
                    <div className="wrapper-navigation-mobile-content">
                        <nav>
                            <NavigationItemBasic onClick={this.onClick} mobile={this.state.mobile} pos="0"
                                                 title="About Us" uri="/about"/>
                            <NavigationItemPrograms mobile={this.state.mobile}
                                                    onClick={this.onClick}
                                                    title="Programs" uri="javascript:void(0)"/>
                            <NavigationItemBasic onClick={this.onClick} mobile={this.state.mobile} title="Videos"
                                                 uri="/videos"/>
                            <NavigationItemBasic onClick={this.onClick} mobile={this.state.mobile}
                                                 title="Parent Resources" uri="/parent-resources"/>
                            <NavigationItemBasic onClick={this.onClick} mobile={this.state.mobile} title="Contact"
                                                 uri="/contact-us"/>
                        </nav>
                    </div>;
            }

            navigation =
                <div>
                    <div className="wrapper-navigation">
                        <div className="wrapper-navigation-mobile-btn" onClick={this.onClick}>
                            <i className={"mobile-nav-menu-btn-icon " + menuIcon}/>
                            <p className="mobile-nav-menu-btn-text">{menuText}</p>
                        </div>
                    </div>
                </div>;

        }

        else {
            navigation =
                <div className="wrapper-navigation">
                    <nav>
                        <NavigationItemBasic mobile={this.state.mobile} pos="0" title="About Us" uri="/about"/>
                        <NavigationItemPrograms mobile={this.state.mobile} title="Programs" uri="javascript:void(0)"/>
                        <NavigationItemBasic mobile={this.state.mobile} title="Videos" uri="/videos"/>
                        <NavigationItemBasic mobile={this.state.mobile} title="Parent Resources"
                                             uri="/parent-resources"/>
                        <NavigationItemBasic mobile={this.state.mobile} title="Contact" uri="/contact-us"/>
                    </nav>
                </div>


        }
        return (

            <div className="container-fluid container-fluid-no-padding">
                <div className="wrapper-logo-and-nav">
                    <div className="wrapper-logo">
                        <Logo />
                    </div>
                    {navigation}
                    <div className="wrapper-navigation-mobile hidden-md hidden-lg">
                        <CSSTransitionGroup transitionName="mobile-content-transition"
                                            transitionEnterTimeout={300}
                                            transitionLeaveTimeout={300}>
                            {navigationMobileDropDown}
                        </CSSTransitionGroup>
                    </div>
                </div>
            </div>
        );
    }


}

export default Navigation;