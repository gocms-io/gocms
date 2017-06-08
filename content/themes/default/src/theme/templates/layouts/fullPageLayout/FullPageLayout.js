import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

class FullPageLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }


    render() {
        return (
            <div className="container">
                {this.props.children}
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(mapStateToProps, {})(FullPageLayout)