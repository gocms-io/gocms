'use strict';

import React from 'react';
import {connect} from 'react-redux'
import {logout} from '../../../../services/authentication'
import {browserHistory} from 'react-router'


class BasicComponent extends React.Component {
    constructor(props) {
        super(props);
        this.handleMenuOpenCloseClick = this.handleMenuOpenCloseClick.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);

        this.state = {
            menuIsOpen: true
        };
    }

    componentDidMount() {
    }

    handleSignOut(e){
        e.preventDefault();
        logout();
        browserHistory.push("/login");

    }

    handleMenuOpenCloseClick(e) {
        this.setState({menuIsOpen: !this.state.menuIsOpen});
    }

    render() {
        // console.log("user: ", this.state.user);
        return (
            <div>
                <div
                    className={"g-container g-a-main-menu-container" + (this.state.menuIsOpen ? " g-a-main-menu-container-open" : " g-a-main-menu-container-close")}>
                    <div
                        className={"g-container g-a-main-menu-title-container" + (this.state.menuIsOpen ? " g-a-main-menu-title-container-open" : " g-a-main-menu-title-container-close")}>
                        <div className="g-a-main-menu-profile-img-container">
                            <a href="" className="g-a-main-menu-profile-img">
                                <i className="gocms-icon-user"/>
                            </a>
                        </div>
                        <div className="g-container-col">
                            <h1 className="g-a-main-menu-title">GoCMS</h1>
                            <h2 className="g-a-main-menu-sub-title"><a className="" href="">{this.props.user.fullName}</a><span className="g-a-main-menu-sign-out"><a href="" onClick={this.handleSignOut}>Sign Out</a></span></h2>
                        </div>
                    </div>
                </div>
                <button
                    className={"g-a-main-menu-btn" + (this.state.menuIsOpen ? " g-a-main-menu-btn-open" : " g-a-main-menu-btn-close")}
                    onClick={this.handleMenuOpenCloseClick}><i className="gocms-icon-menu"/></button>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps, {

})(BasicComponent);