import React, {PropTypes} from 'react'
import {connect} from 'react-redux'


class DefaultTemplate extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div id="default-theme">
                {this.props.children}
            </div>
        );
    }
}

DefaultTemplate.propTypes = {
    children: PropTypes.node
};

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(mapStateToProps, {})(DefaultTemplate)