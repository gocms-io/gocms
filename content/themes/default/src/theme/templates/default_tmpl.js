import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import Header from '../containers/header/header.container'
import Footer from '../containers/footer/footer.container'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup' // ES6


class DefaultTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this); //bind function once
        this.state = {
            screenType: window.innerWidth < 992 ? "mobile" : "desktop"
        };
    }

    handleResize(e) {
        this.setState({
            screenType: window.innerWidth < 992 ? "mobile" : "desktop"
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }


    render() {
        let html =
            <div key={this.props.location.pathname}
                 className="container-fluid container-fluid-no-padding page-content">
                {this.props.children}
            </div>;
        return (
            <div id="bslf-theme">
                <Header screenType={this.state.screenType}/>
                <CSSTransitionGroup transitionName="page-content-transition"
                                    transitionEnterTimeout={500}
                                    transitionLeaveTimeout={300}>
                    {html}
                </CSSTransitionGroup>
                <Footer screenType={this.state.screenType}/>
            </div>
        )
    }
}

DefaultTemplate.propTypes = {
    children: PropTypes.node
};

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(mapStateToProps, {})(DefaultTemplate)