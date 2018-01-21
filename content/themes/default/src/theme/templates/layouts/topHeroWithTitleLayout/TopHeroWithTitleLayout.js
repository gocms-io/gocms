import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import TopHeroLayout from '../topHeroLayout/TopHeroLayout'

class TopHeroWithTitleLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }


    render() {
        return (
            <TopHeroLayout height={this.props.height}
                           backgroundImage={this.props.backgroundImage}
            >
                <div className="container container-no-padding">
                    <div className="page-title-wrapper">
                        <h1 className="page-title">{this.props.title}</h1>
                        <hr className="page-title-page-break"/>
                    </div>
                </div>
                {this.props.children}
            </TopHeroLayout>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(mapStateToProps, {})(TopHeroWithTitleLayout)