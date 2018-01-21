'use strict';

import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import ProgramsMenuItem from '../programsMenuItem/ProgramsMenuItem'
import ProgramsMenuItemBasic from '../programsMenuItemBasic/ProgramsMenuItemBasic'


class ProgramsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({open: nextProps.open});
    }

    render() {
        let html = null;
        let programsMenu = null;
        let programMenuDivide = null;

        if (this.props.mobile) {

            if (this.state.open) {

                programsMenu =
                    <div className="wrapper-programs-menu-mobile">
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/lamb.jpg" title="Lovable Lambs"
                                          uri="/classes/lovable-lambs" details="6w to 5m"
                                          onClick={this.props.onClick}
                                          mobile={this.props.mobile}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/giraffe.jpg" title="Gentle Giraffes"
                                          uri="/classes/gentle-giraffes" details="5m to 13m"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/critter.jpg" title="Curious Critters"
                                          uri="/classes/curious-critters" details="13m to 18m"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/hippo.jpg" title="Helpful Hippos"
                                          uri="/classes/helpful-hippos" details="18m to 22m"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/kangaroos.jpg" title="Kindhearted Kangaroos"
                                          uri="/classes/kindhearted-kangaroos" details="22m to 24m"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/elephant.jpg" title="Enthusiastic Elephants"
                                          uri="/classes/enthusiastic-elephants" details="24m to 27m"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/chipmunk.jpg" title="Cheerful Chipmunks"
                                          uri="/classes/cheerful-chipmunks" details="2.5yrs to 3yrs"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/turtle.jpg" title="Trustworthy Turtles"
                                          uri="/classes/trustworthy-turtles" details="3yrs to 3.5yrs"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/cub.jpg" title="Courageous Cubs"
                                          uri="/classes/courageous-cubs" details="3.5yrs to 4yrs"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/jaguars.jpg" title="Joyful Jaguars"
                                          uri="/classes/joyful-jaguars" details="3.5yrs to 4yrs"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/penguins.jpg" title="Patient Penguins"
                                          uri="/classes/patient-penguins" details="3.5yrs to 4yrs"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/frog.jpg" title="Friendly Frogs"
                                          uri="/classes/friendly-frogs" details="4yrs to 5yrs"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItem icon="/themes/bslf/img/icons/raccoon.jpg" title="Responsible Racoons"
                                          uri="/classes/responsible-raccoons" details="5yrs to 6yrs"
                                          mobile={this.props.mobile}
                                          onClick={this.props.onClick}
                                          onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <hr className="programs-menu-mobile-divider" />
                        <ProgramsMenuItemBasic title="Tuition" uri="/tuition"
                                               mobile={this.props.mobile}
                                               onClick={this.props.onClick}
                                               onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItemBasic title="Field Trips" uri="/field-trips"
                                               mobile={this.props.mobile}
                                               onClick={this.props.onClick}
                                               onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItemBasic title="Sample Lesson Plan" uri="/sample-lesson-plan"
                                               mobile={this.props.mobile}
                                               onClick={this.props.onClick}
                                               onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItemBasic title="Monthly Themes" uri="/monthly-themes"
                                               mobile={this.props.mobile}
                                               onClick={this.props.onClick}
                                               onMenuItemSelected={this.props.onMenuItemSelected}/>
                        <ProgramsMenuItemBasic title="Sample Daily Food Menu" uri="/menu"
                                               mobile={this.props.mobile}
                                               onClick={this.props.onClick}
                                               onMenuItemSelected={this.props.onMenuItemSelected}/>
                    </div>
            }

            html =
                <CSSTransitionGroup transitionName="programs-menu-transition-mobile"
                                    transitionEnterTimeout={300}
                                    transitionLeaveTimeout={300}>
                    {programsMenu}
                </CSSTransitionGroup>;
        }
        else {
            if (this.state.open) {
                programMenuDivide =
                    <span className="program-navigation-item-divide">
                </span>;

                programsMenu =
                    <div className="programs-menu container">
                        <div className="program-menu-left-1-col">
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/lamb.jpg" title="Lovable Lambs"
                                              uri="/classes/lovable-lambs" details="6w to 5m"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/giraffe.jpg" title="Gentle Giraffes"
                                              uri="/classes/gentle-giraffes" details="5m to 13m"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/critter.jpg" title="Curious Critters"
                                              uri="/classes/curious-critters" details="13m to 18m"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/hippo.jpg" title="Helpful Hippos"
                                              uri="/classes/helpful-hippos" details="18m to 22m"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/kangaroos.jpg" title="Kindhearted Kangaroos"
                                              uri="/classes/kindhearted-kangaroos" details="22m to 24m"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/elephant.jpg" title="Enthusiastic Elephants"
                                              uri="/classes/enthusiastic-elephants" details="24m to 27m"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/chipmunk.jpg" title="Cheerful Chipmunks"
                                              uri="/classes/cheerful-chipmunks" details="2.5yrs to 3yrs"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                        </div>
                        <div className="program-menu-left-2-col">
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/turtle.jpg" title="Trustworthy Turtles"
                                              uri="/classes/trustworthy-turtles" details="3yrs to 3.5yrs"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/cub.jpg" title="Courageous Cubs"
                                              uri="/classes/courageous-cubs" details="3.5yrs to 4yrs"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/jaguars.jpg" title="Joyful Jaguars"
                                              uri="/classes/joyful-jaguars" details="3.5yrs to 4yrs"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/penguins.jpg" title="Patient Penguins"
                                              uri="/classes/patient-penguins" details="3.5yrs to 4yrs"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/frog.jpg" title="Friendly Frogs"
                                              uri="/classes/friendly-frogs" details="4yrs to 5yrs"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItem icon="/themes/bslf/img/icons/raccoon.jpg" title="Responsible Raccoons"
                                              uri="/classes/responsible-raccoons" details="5yrs to 6yrs"
                                              onMenuItemSelected={this.props.onMenuItemSelected}/>
                        </div>
                        <div className="program-menu-divide">
                        </div>

                        <div className="program-menu-right-col">
                            <ProgramsMenuItemBasic title="Tuition" uri="/tuition"
                                                   onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItemBasic title="Field Trips" uri="/field-trips"
                                                   onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItemBasic title="Sample Lesson Plan" uri="/sample-lesson-plan"
                                                   onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItemBasic title="Monthly Themes" uri="/monthly-themes"
                                                   onMenuItemSelected={this.props.onMenuItemSelected}/>
                            <ProgramsMenuItemBasic title="Sample Daily Food Menu" uri="/menu"
                                                   onMenuItemSelected={this.props.onMenuItemSelected}/>
                        </div>
                    </div>
                ;
            }

            html =
                <div className="wrapper-program-menu">
                    <CSSTransitionGroup transitionName="programs-menu-divide-transition"
                                        transitionEnterTimeout={50}
                                        transitionLeaveTimeout={550}>
                        {programMenuDivide}
                    </CSSTransitionGroup>

                    <CSSTransitionGroup transitionName="programs-menu-transition"
                                        transitionEnterTimeout={550}
                                        transitionLeaveTimeout={500}>
                        {programsMenu}
                    </CSSTransitionGroup>
                </div>;
        }

        return (html);
    }


}

export default ProgramsMenu;