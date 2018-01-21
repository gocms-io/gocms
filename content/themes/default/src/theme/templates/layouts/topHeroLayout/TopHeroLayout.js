import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import HeroImage from '../../../components/heroImage/HeroImage'

class TopHeroLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }


    render() {
        return (
            <div>
                <div className="container-fluid container-fluid-no-padding">
                    <HeroImage height={this.props.height}
                               backgroundImage={this.props.backgroundImage}>
                    </HeroImage>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(mapStateToProps, {})(TopHeroLayout)