'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'


class AccordionSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
    }

    onClick(e) {
        e.preventDefault();
        this.setState({open: !this.state.open});
    }

    render() {
        let statusIcon = "+";
        let openTitleClass = "";
        let openWrapperClass = "";
        let openContentClass = "";
        if (this.state.open) {
            statusIcon = "-";
            openWrapperClass = "accordion-section-wrapper-open";
            openTitleClass = "accordion-section-title-wrapper-open";
            openContentClass = "accordion-section-content-wrapper-open";
        }

        return (
            <div className={"accordion-section-wrapper " + openWrapperClass}>
                <div className={"accordion-section-title-wrapper " + openTitleClass} onClick={this.onClick}>
                    <h2>{this.props.title}</h2>
                    <i className="accordion-section-action">{statusIcon}</i>
                </div>
                <div className={"accordion-section-content-wrapper " + openContentClass}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(AccordionSection);