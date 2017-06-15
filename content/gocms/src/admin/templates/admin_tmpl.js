import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import MainMenu from '../containers/adminPages/components/mainMenu/MainMenu'


class AdminTemplate extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="g-a">
               <MainMenu />
                <div id="g-a-main-container">
                    {this.props.children}
                </div>
            </div>

        )
    }
}

AdminTemplate.propTypes = {
    children: PropTypes.node
};

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(mapStateToProps, {})(AdminTemplate)