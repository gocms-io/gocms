'use strict';

import React from 'react';
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import TwoColumnLayout from '../../templates/layouts/twoColumnLayout/TwoColumnLayout'
import TopHeroLayout from '../../templates/layouts/topHeroLayout/TopHeroLayout'
import CalloutBox from '../../components/calloutBox/CalloutBox'
import {Link} from 'react-router';
import ContactForm from '../../components/contactForm/ContactForm'



class TuitionPage extends React.Component {
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

            let tuitionCardAry = this.getTuitionCards(c.tuitionCards);

            // mobile
            if (this.state.screenType === "mobile") {
                html =
                    <TopHeroLayout
                        key="mobile"
                        height={c.topHero.backgroundImage.heightMobile}
                        backgroundImage={c.topHero.backgroundImage.src}
                    >
                        <div className="container container-top-mobile-title-description">
                            <h1>{c.tuitionTitle}</h1>
                            <p>{c.tuitionContent}</p>
                            <hr/>
                        </div>
                        <div className="container">
                            <h2>Schedule A Tour</h2>
                            <ContactForm
                                id={"classroom-page-contact-form-"+c.tuitionTitle}
                                name={"classroom-page-contact-form-"+c.tuitionTitle}
                                location={c.tuitionTitle}
                                className="two-column-template-contact-form"
                                buttonText="Schedule a Tour"
                            />
                            <br/>
                            <hr />
                        </div>
                        <div className="container">
                            {tuitionCardAry}
                        </div>

                    </TopHeroLayout>
                ;
            }
            // dekstop
            else {
                html =
                    <TwoColumnLayout
                        topHero={{
                            backgroundImage: {
                                height: c.topHero.backgroundImage.height,
                                backgroundImage: c.topHero.backgroundImage.src
                            }
                        }}
                        leftColumnTitle={c.tuitionTitle}
                        leftColumnContent={c.tuitionContent}
                        key="desktop"
                    >
                        <div className="tuition-page-tuition-cards-wrapper">
                            {tuitionCardAry}
                        </div>
                    </TwoColumnLayout>
                ;
            }
        }

        return (html);
    }

    getTuitionCards(tuitionCards) {
        let tuitionCardAry = [];
        for (let i = 0; i < tuitionCards.length; i++) {
            let tc = tuitionCards[i];
            let costListHtml = [];
            for (let j = 0; j < tc.cost.length; j++) {
                costListHtml.push(<li key={j}>{tc.cost[j]}</li>)
            }
            let tcHtml = null;
            // mobile
            if (this.state.screenType === "mobile") {
                tcHtml =
                    <divs className="tuition-page-callout-box tuition-page-callout-box-mobile"
                    key={i+"-mobile"}>
                        <h2>{tc.title}</h2>
                        <h3>{tc.subTitle}</h3>
                        <ul className={tc.subTitle ? "" : "no-sub-title"}>{costListHtml}</ul>
                        <Link to={tc.programUrl} className="btn btn-primary btn-primary-mobile">View Program</Link>
                        {i==(tuitionCards.length-1) ? "" : <hr/>}
                    </divs>
            }
            //desktop
            else {
                tcHtml =
                    <CalloutBox key={i+"-desktop"}
                                className={"tuition-page-callout-box " + (i % 2 ? "tuition-page-callout-box-odd" : "")}>
                        <h2>{tc.title}</h2>
                        <h3>{tc.subTitle}</h3>
                        <ul className={tc.subTitle ? "" : "no-sub-title"}>{costListHtml}</ul>
                        <Link to={tc.programUrl} className="btn btn-primary">View Program</Link>
                    </CalloutBox>;
            }
            tuitionCardAry.push(tcHtml);
        }
        return tuitionCardAry
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
})(TuitionPage);