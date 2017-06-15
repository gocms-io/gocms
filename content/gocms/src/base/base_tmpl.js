import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

class BaseTemplate extends React.Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        window.addEventListener('resize', this.handleResize);

        let loaderStyle = document.getElementById("loader-page-wrapper").style;
        let appStyle = document.getElementById("app").style;
        appStyle.overflowY = "hidden";
        // wait for entire dom to finish and then fade loading screen.
        window.onload = function () {
            setTimeout(function () {
                loaderStyle.opacity = 0;

                // after fade start we can fade in actual site
                setTimeout(function () {
                    appStyle.overflowY = "";
                    setTimeout(function () {
                        appStyle.opacity = 1;
                    }, 250);
                }, 500);
                // once loading screen is completely gone we can remove it from dom view
                setTimeout(function () {
                    loaderStyle.display = "none";
                }, 750);
            }, 250);
        }
    }

    render() {
        return (
            <div id="goCMS">
                {this.props.children}
            </div>
        )
    }
}

BaseTemplate.propTypes = {
    children: PropTypes.node
};

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(mapStateToProps, {})(BaseTemplate)