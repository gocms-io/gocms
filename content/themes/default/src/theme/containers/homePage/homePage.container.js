'use strict';

import React from 'react';
import HeroImage from '../../components/heroImage/HeroImage'
import BoxCalloutSection from '../../components/boxCalloutSection/BoxCalloutSection'
import ContactForm from '../../components/contactForm/ContactForm'
import NewsEventsCarousel from './components/newsEventsCarousel/NewsEventsCarousel'
import NewsEventItem from './components/newsEventItem/NewsEventItem'
import CalloutBox from '../../components/calloutBox/CalloutBox'
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import {Link} from 'react-router'


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this); //bind function once
        this.state = {
            screenType: window.innerWidth < 992 ? "mobile" : "desktop"
        };
    }


    handleResize(e) {
        let screenType = window.innerWidth < 992 ? "mobile" : "desktop";
        if (screenType != this.state.screenType) {
            this.setState({
                screenType: screenType
            });
        }

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

    render() {
        let html = null;
        if (!!this.props.content) {
            let c = this.props.content;

            // mobile
            if (this.state.screenType === "mobile") {
                html =
                    <div key="mobile">
                        <HeroImage height={c.topHero.backgroundImage.heightMobile}
                                   backgroundImage={c.topHero.backgroundImage.src}/>

                        <BoxCalloutSection className="three-box-callout-home" height="880px">
                            <CalloutBox className="three-box-callout-box three-box-callout-box-left">
                                <h2>{c.boxCalloutSection.box1.title}</h2>
                                <img src={c.boxCalloutSection.box1.image.src} alt={c.boxCalloutSection.box1.image.alt}/>
                                <p>{c.boxCalloutSection.box1.text}</p>
                            </CalloutBox>
                            <CalloutBox className="three-box-callout-box three-box-callout-box-center">
                                <h2>{c.boxCalloutSection.box2.title}</h2>
                                <img src={c.boxCalloutSection.box2.image.src} alt={c.boxCalloutSection.box2.image.alt}/>
                                <p>{c.boxCalloutSection.box2.text}</p>
                            </CalloutBox>
                            <CalloutBox
                                className="three-box-callout-box three-box-callout-box-right three-box-callout-box-home-contact">
                                <h2>{c.boxCalloutSection.box3.title}</h2>
                                <ContactForm
                                    id="home-page-contact-form"
                                    name="home-page-contact-form"
                                    location="home"
                                />
                            </CalloutBox>
                        </BoxCalloutSection>
                        {buildNewsAndEvents(c.newsAndEvents, "mobile", "true")}
                        <HeroImage className="home-page-bottom-hero"
                                   height={c.heroMissionStatement.backgroundImage.heightMobile}
                                   backgroundImage={c.heroMissionStatement.backgroundImage.src}/>
                        <div className="container home-page-mission-statement-mobile">
                            <h1>{c.heroMissionStatement.title}</h1>
                            <hr/>
                            <p>{c.heroMissionStatement.body}</p>
                            <Link to="/about" className="btn btn-primary">{c.heroMissionStatement.button.text}</Link>
                        </div>
                    </div>
            }
            // desktop
            else {
                html =
                    <div key="desktop">
                        <HeroImage height={c.topHero.backgroundImage.height}
                                   backgroundImage={c.topHero.backgroundImage.src}>
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-11 col-lg-push-1">
                                        <h1 className="hero-title-home">{c.topHero.title}</h1>
                                        <Link to="/about"
                                              className="btn btn-primary hero-title-home-btn">{c.topHero.button.text}</Link>
                                    </div>
                                </div>
                            </div>
                        </HeroImage>
                        <BoxCalloutSection
                            className={"three-box-callout-home" + (c.newsAndEvents.length > 0 ? "" : " no-news-and-events")}
                        >
                            <CalloutBox className="three-box-callout-box three-box-callout-box-left">
                                <h2>{c.boxCalloutSection.box1.title}</h2>
                                <img src={c.boxCalloutSection.box1.image.src} alt={c.boxCalloutSection.box1.image.alt}/>
                                <p>{c.boxCalloutSection.box1.text}</p>
                            </CalloutBox>
                            <CalloutBox className="three-box-callout-box three-box-callout-box-center">
                                <h2>{c.boxCalloutSection.box2.title}</h2>
                                <img src={c.boxCalloutSection.box2.image.src} alt={c.boxCalloutSection.box2.image.alt}/>
                                <p>{c.boxCalloutSection.box2.text}</p>
                            </CalloutBox>
                            <CalloutBox className="three-box-callout-box three-box-callout-box-right">
                                <h2>{c.boxCalloutSection.box3.title}</h2>
                                <ContactForm
                                    id="home-page-contact-form"
                                    name="home-page-contact-form"
                                    location="home"
                                />
                            </CalloutBox>
                        </BoxCalloutSection>

                        {buildNewsAndEvents(c.newsAndEvents, "desktop", null)}
                        <HeroImage className="home-page-bottom-hero"
                                   height={c.heroMissionStatement.backgroundImage.height}
                                   backgroundImage={c.heroMissionStatement.backgroundImage.src}>
                            <div className="container container-no-padding">
                                <CalloutBox className="callout-box-home-mission-statement">
                                    <h1>{c.heroMissionStatement.title}</h1>
                                    <p><span
                                        className="text-home-mission-statement">{c.heroMissionStatement.body}</span>
                                    </p>
                                    <Link to="/about"
                                          className="btn btn-primary">{c.heroMissionStatement.button.text}</Link>
                                </CalloutBox>
                            </div>
                        </HeroImage>
                    </div>
            }
        }

        return (html);
    }
}

function buildNewsAndEvents(nae, key, isMobile) {
    let newsAndEvents = [];
    for (var i = 0; i < nae.length; i++) {
        let body = <p>{nae[i].body}</p>;
        if (nae[i].rawHtml) {
            body = <p dangerouslySetInnerHTML={{__html: nae[i].body}}/>;
        }

        newsAndEvents.push(
            <NewsEventItem key={i}>
                <h2>{nae[i].title}</h2>
                <h4>{nae[i].date}</h4>
                <hr/>
                {body}
            </NewsEventItem>
        );
    }

    if (newsAndEvents.length > 0) {
        return (
            <NewsEventsCarousel key={key} mobile={isMobile}>
                {newsAndEvents}
            </NewsEventsCarousel>
        );
    }

    return null;
}

function mapStateToProps(state) {
    let content = null;
    let path = "/";
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
})(HomePage);