'use strict';

import React from 'react';
import HeroImage from '../../components/heroImage/HeroImage'
import ThreeBoxCallout from '../../components/threeBoxCallout/ThreeBoxCallout'
import ContactForm from '../../components/contactForm/ContactForm'
import NewsEventsCarousel from './components/newsEventsCarousel/NewsEventsCarousel'
import NewsEventItem from './components/newsEventItem/NewsEventItem'
import CalloutBox from '../../components/calloutBox/CalloutBox'
import {requestPage} from '../../config/actions/page'

import {connect} from 'react-redux'


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentWillMount() {
        this.props.requestPage(this.props.path);
    }

    componentDidMount() {
    }


    render() {
        let html = null;
        if (!!this.props.content) {
            let c = this.props.content;
            html =
                <div>
                    <HeroImage height={c.topHero.backgroundImage.height}
                               backgroundImage={c.topHero.backgroundImage.src}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-11 col-lg-push-1">
                                    <h1 className="hero-title-home">{c.topHero.title}</h1>
                                    <button
                                        className="btn btn-primary hero-title-home-btn">{c.topHero.button.text}</button>
                                </div>
                            </div>
                        </div>
                    </HeroImage>
                    <ThreeBoxCallout className="three-box-callout-home">
                        <CalloutBox className="three-box-callout-box three-box-callout-box-left">
                            <h2>{c.threeBoxCallout.box1.title}</h2>
                            <img src={c.threeBoxCallout.box1.image.src} alt={c.threeBoxCallout.box1.image.alt}/>
                            <p>{c.threeBoxCallout.box1.text}</p>
                        </CalloutBox>
                        <CalloutBox className="three-box-callout-box three-box-callout-box-center">
                            <h2>{c.threeBoxCallout.box2.title}</h2>
                            <img src={c.threeBoxCallout.box2.image.src} alt={c.threeBoxCallout.box2.image.alt}/>
                            <p>{c.threeBoxCallout.box2.text}</p>
                        </CalloutBox>
                        <CalloutBox className="three-box-callout-box three-box-callout-box-right">
                            <h2>{c.threeBoxCallout.box3.title}</h2>
                            <ContactForm />
                        </CalloutBox>
                    </ThreeBoxCallout>
                    <NewsEventsCarousel >
                        {buildNewsAndEvents(c.newsAndEvents)}
                    </NewsEventsCarousel>
                    <HeroImage height={c.heroMissionStatement.backgroundImage.height}
                               backgroundImage={c.heroMissionStatement.backgroundImage.src}>
                        <div className="container">
                            <CalloutBox className="callout-box-home-mission-statement">
                                <h1>{c.heroMissionStatement.title}</h1>
                                <p><span className="text-home-mission-statement">{c.heroMissionStatement.body}</span>
                                </p>
                                <button className="btn btn-primary">{c.heroMissionStatement.button.text}</button>
                            </CalloutBox>
                        </div>
                    </HeroImage>
                </div>
            ;
        }

        return (html);
    }
}

function buildNewsAndEvents(nae) {
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
    return newsAndEvents;
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