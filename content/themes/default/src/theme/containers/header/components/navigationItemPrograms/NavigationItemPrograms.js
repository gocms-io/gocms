'use strict';

import enhanceWithClickOutside from 'react-click-outside'
import React from 'react';
import NavigationItemBasic from '../navigationItemBasic/NavigationItemBasic'
import ProgramsMenu from '../programsMenu/ProgramsMenu'


class ProgramsNavigationItem extends React.Component {


    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.handleMenuItemSelection = this.handleMenuItemSelection.bind(this);
        this.state = {
            open: false,
            ignoreBecauseOfOutsideClick: false
        };
    }

    handleClickOutside() {
        if (this.state.open) {
            this.setState({open: false})
        }
    }

    onClick(e) {
        e.preventDefault();
        this.setState({open: !this.state.open});
    }

    handleMenuItemSelection() {
        this.setState({open: !this.state.open});
    }

    render() {


        return (
            <span className="position-relative">
                <NavigationItemBasic mobile={this.props.mobile} title={this.props.title} uri={this.props.uri}
                                     onClick={this.onClick}/>

                <ProgramsMenu mobile={this.props.mobile} open={this.state.open} onClick={this.props.onClick} onMenuItemSelected={this.handleMenuItemSelection}/>
            </span>
        )
    }


}

export default enhanceWithClickOutside(ProgramsNavigationItem);