'use strict';

import React from 'react';
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import TwoColumnLayout from '../../templates/layouts/twoColumnLayout/TwoColumnLayout'
import CalloutBox from '../../components/calloutBox/CalloutBox'
import TopHeroLayout from '../../templates/layouts/topHeroLayout/TopHeroLayout'
import ContactForm from '../../components/contactForm/ContactForm'



class FieldTripPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this); //bind function once
        this.state = {
            screenType: window.innerWidth < 992 ? "mobile" : "desktop"
        };
    }


    componentWillMount() {
        this.props.requestPage(this.props.path);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize(e) {
        let screenType = window.innerWidth < 992 ? "mobile" : "desktop";
        if (screenType != this.state.screenType) {
            this.setState({
                screenType: screenType
            });
        }

    }

    render() {

        let html = null;
        if (!!this.props.content) {
            let c = this.props.content;

            let fieldTripCardAry = this.getFieldTrips(c.fieldTripCards);

            // mobile
            if (this.state.screenType === "mobile") {
                html =
                    <TopHeroLayout
                        key="mobile"
                        height={c.topHero.backgroundImage.heightMobile}
                        backgroundImage={c.topHero.backgroundImage.src}
                    >
                        <div className="container container-top-mobile-title-description">
                            <h1>{c.fieldTripTitle}</h1>
                            <p>{c.fieldTripContent}</p>
                            <hr/>
                        </div>

                        <div className="container">
                            <h2>Schedule A Tour</h2>
                            <ContactForm
                                id={"classroom-page-contact-form-"+c.fieldTripTitle}
                                name={"classroom-page-contact-form-"+c.fieldTripTitle}
                                location={c.fieldTripTitle}
                                className="two-column-template-contact-form"
                                buttonText="Schedule a Tour"
                            />
                            <br/>
                            <hr />
                        </div>

                        <div className="container field-trip-page-field-trip-cards-wrapper field-trip-page-field-trip-cards-wrapper-mobile">
                            {fieldTripCardAry}
                        </div>
                    </TopHeroLayout>
            }
            // desktop
            else {
                html =
                    <TwoColumnLayout
                        topHero={{
                            backgroundImage: {
                                height: c.topHero.backgroundImage.height, backgrounImage: c.topHero.backgroundImage.src
                            }
                        }}
                        leftColumnTitle={c.fieldTripTitle}
                        leftColumnContent={c.fieldTripContent}
                        key="desktop"
                    >
                        <div className="field-trip-page-field-trip-cards-wrapper">
                            {fieldTripCardAry}
                        </div>
                    </TwoColumnLayout>
                ;
            }
        }

        return (html);
    }

    getFieldTrips(fieldTripCards) {
        let fieldTripCardAry = [];

        for (let i = 0; i < fieldTripCards.length; i++) {
            let ftc = fieldTripCards[i];

            let tcHtml = null;
            if (this.state.screenType === "mobile") {
                tcHtml =
                    <div key={i+"-mobile"} className="field-trip-page-callout-box field-trip-page-callout-box-mobile">
                        <h2>{ftc.title}</h2>
                        <h3>{ftc.subTitle}</h3>
                        <img src={ftc.image.src} alt={ftc.image.alt}/>
                        <p>{ftc.content}</p>
                        {i==(fieldTripCards.length-1) ? "" : <hr/>}
                        {i==(fieldTripCards.length-1) ? "" : <br/>}
                    </div>;
            }
            // desktop
            else {
                tcHtml =
                    <CalloutBox key={i+"-desktop"} className="field-trip-page-callout-box">
                        <h2>{ftc.title}</h2>
                        <h3>{ftc.subTitle}</h3>
                        <p>{ftc.content}</p>
                        <img src={ftc.image.src} alt={ftc.image.alt}/>
                    </CalloutBox>;
            }
            fieldTripCardAry.push(tcHtml);
        }
        return fieldTripCardAry;
    }
}

function mapStateToProps(state, ownProps) {
    let content = null;
    let path = ownProps.location.pathname;
    let page = state.page[path];
    if (!!page && !!page.content) {
        content = page.content;
    }
    return {
        content: content,
        path: path
    }
}

export default connect(mapStateToProps, {
    requestPage
})(FieldTripPage);