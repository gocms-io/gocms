'use strict';

import React from 'react';
import {connect} from 'react-redux'
import FooterContent from './components/footerContent/FooterContent'
import CopyrightBar from './components/copyrightBar/CopyrightBar'


class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screenType: this.props.screenType
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.screenType !== this.state.screenType) {
            this.setState({screenType: nextProps.screenType});
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="wrapper-footer">
                <FooterContent screenType={this.state.screenType} />
                <CopyrightBar/>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(Footer);