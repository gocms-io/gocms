'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'


class HeroImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wrapperStyle: {
                backgroundImage: 'url("' + this.props.backgroundImage + '")',
                backgroundSize: this.props.backgroundSize,
                backgroundPosition: this.props.backgroundPosition,
                backgroundColor: this.props.backgroundColor,
                backgroundRepeat: this.props.backgroundRepeat,
                height: this.props.height,
                width: '100%',
            }
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="container-fluid-no-padding">
                <div className={`hero-image-wrapper ${this.props.className}`} style={this.state.wrapperStyle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(HeroImage);