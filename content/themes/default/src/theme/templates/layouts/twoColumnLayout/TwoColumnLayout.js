import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import TopHeroLayout from '../topHeroLayout/TopHeroLayout'
import ContactForm from '../../../components/contactForm/ContactForm'

class TwoColumnLayout extends React.Component {
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
                <div className="container">
                    <div className="two-column-template-wrapper">
                        <div className="two-column-template-col-left">
                            <h1 className="two-column-template-title">{this.props.leftColumnTitle}</h1>
                            <hr className="two-column-template-title-break"/>
                            <p className="two-column-template-content">{this.props.leftColumnContent}</p>
                            <hr className="two-column-template-content-break"/>
                            <h2 className="two-column-template-contact-form-title">Schedule a Tour</h2>
                            <ContactForm
                                id={"classroom-page-contact-form-"+this.props.leftColumnTitle}
                                name={"classroom-page-contact-form-"+this.props.leftColumnTitle}
                                location={this.props.leftColumnTitle}
                                className="two-column-template-contact-form"
                                         buttonText="Schedule a Tour"
                            />
                        </div>
                        <div className="two-column-template-col-right">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </TopHeroLayout>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(mapStateToProps, {})(TwoColumnLayout)