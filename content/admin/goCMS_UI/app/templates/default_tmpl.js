import React, {PropTypes} from 'react'
import {connect} from 'react-redux'


class DefaultTemplate extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="hidden-xs hidden-sm">
                <div className="container-fluid container-fluid-no-padding">
                    {this.props.children}
                </div>
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