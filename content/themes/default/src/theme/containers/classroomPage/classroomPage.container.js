'use strict';

import React from 'react';
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import ClassroomDetails from './components/classroomDetails/ClassroomDetails'
import ClassroomGallery from './components/classroomGallery/ClassroomGallery'
import CalloutBox from '../../components/calloutBox/CalloutBox'
import Divider from '../../components/divider/Divider'
import ContactForm from '../../components/contactForm/ContactForm'
import BoxCalloutSection from '../../components/boxCalloutSection/BoxCalloutSection'
import TopHeroLayout from '../../templates/layouts/topHeroLayout/TopHeroLayout'


class ClassroomPage extends React.Component {
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.path != this.props.path) {
            this.props.requestPage(nextProps.path);
        }

        if (this.props.content != nextProps.content) {
            this.setState({
                newContent: nextProps.content
            });
        }
    }


    render() {
        let html = null;
        if (!!this.props.content) {
            let c = this.props.content;

            let mainContentList = [];
            for (let i = 0; i < c.classroomDetails.mainContent.list.length; i++) {
                mainContentList.push(<li key={"content-list-" + i}>{c.classroomDetails.mainContent.list[i]}</li>);
            }

            let calloutBoxList = [];
            for (let j = 0; j < c.boxCalloutSection.boxes.length; j++) {
                let cb = c.boxCalloutSection.boxes[j];
                calloutBoxList.push(
                    <CalloutBox key={"callout-box-" + j}>
                        <h2>{cb.title}</h2>
                        <img src={cb.image.src}
                             alt={cb.image.alt}/>
                        <p>{cb.text}</p>
                    </CalloutBox>
                );
            }

            // mobile
            if (this.state.screenType === "mobile") {
                html =
                    <TopHeroLayout
                        key="mobile"
                        height={c.topHero.backgroundImage.heightMobile}
                        backgroundImage={c.topHero.backgroundImage.src}
                    >
                        <ClassroomDetails>
                            <div className="callout-box-wrapper">
                                <div className="callout-box-classroom-icon-wrapper">
                                    <div className="callout-box-classroom-icon"
                                         style={{"backgroundImage": `url(${c.classroomDetails.calloutBox.icon.src})`}}>
                                    </div>
                                </div>
                                <CalloutBox className="callout-box-classroom-cta callout-box-classroom-cta-mobile">
                                    <h1>{c.classroomDetails.calloutBox.title}</h1>
                                    <h2>{c.classroomDetails.calloutBox.subTitle}</h2>
                                    <p>{c.classroomDetails.calloutBox.content}</p>
                                    { !c.classroomDetails.calloutBox.cameraFeed ? null :
                                        <a className="classroom-details-video-feed classroom-details-video-feed-mobile"
                                           target="_blank" href={c.classroomDetails.calloutBox.cameraFeed}>Secure Video
                                            Feed</a>}
                                    <br/>
                                    { !c.classroomDetails.calloutBox.cameraFeed2 ? null :
                                        <a className="classroom-details-video-feed classroom-details-video-feed-2 classroom-details-video-feed-mobile classroom-details-video-feed-mobile-2"
                                           target="_blank" href={c.classroomDetails.calloutBox.cameraFeed2}>Secure Video
                                            Feed (Camera 2)</a>}
                                </CalloutBox>
                            </div>
                            <div className="wrapper-classroom-details wrapper-classroom-details-mobile">
                                <div className="container">
                                    <h1>{c.classroomDetails.mainContent.title}</h1>
                                    <p>{c.classroomDetails.mainContent.content}</p>
                                    <ul>
                                        {mainContentList}
                                    </ul>

                                    <ContactForm
                                        id={"classroom-page-contact-form-" + c.classroomDetails.calloutBox.title}
                                        name={"classroom-page-contact-form-" + c.classroomDetails.calloutBox.title}
                                        location={c.classroomDetails.calloutBox.title}
                                        className="contact-form-wrapper-classroom-cta contact-form-wrapper-classroom-cta-mobile"
                                    />
                                </div>
                            </div>
                        </ClassroomDetails>
                        <div className="teacher-bio-classroom-wrapper teacher-bio-classroom-wrapper-mobile">
                            <div className="container">
                                <h1>{c.boxCalloutSection.title}</h1>
                            </div>

                            <BoxCalloutSection
                                className="box-callout-section-classroom box-callout-section-classroom-mobile"
                                height="100%">
                                {calloutBoxList}
                            </BoxCalloutSection>
                        </div>
                        <ClassroomGallery className="classroom-gallery-wrapper-mobile" images={c.gallery.images}
                                          mobile="true">
                            <div className="container">
                                <h1>{c.gallery.title}</h1>
                            </div>
                        </ClassroomGallery>
                    </TopHeroLayout>
            }
            // desktop
            else {

                html =

                    <TopHeroLayout
                        key="desktop"
                        height={c.topHero.backgroundImage.height}
                        backgroundImage={c.topHero.backgroundImage.src}
                    >
                        <ClassroomDetails>
                            <div className="container container-no-padding">
                                <div className="classroom-details-left-col">
                                    <div className="callout-box-wrapper">
                                        <div className="callout-box-classroom-icon-wrapper">
                                            <div className="callout-box-classroom-icon"
                                                 style={{"backgroundImage": `url(${c.classroomDetails.calloutBox.icon.src})`}}>
                                            </div>
                                        </div>
                                        <CalloutBox className="callout-box-classroom-cta">
                                            <h1>{c.classroomDetails.calloutBox.title}</h1>
                                            <h2>{c.classroomDetails.calloutBox.subTitle}</h2>
                                            <p>{c.classroomDetails.calloutBox.content}</p>
                                            { !c.classroomDetails.calloutBox.cameraFeed ? null :
                                                <a className="classroom-details-video-feed" target="_blank"
                                                   href={c.classroomDetails.calloutBox.cameraFeed}>Secure Video
                                                    Feed</a>}
                                            { !c.classroomDetails.calloutBox.cameraFeed2 ? null :
                                                <a className="classroom-details-video-feed classroom-details-video-feed-2" target="_blank"
                                                   href={c.classroomDetails.calloutBox.cameraFeed2}>Secure Video Feed
                                                    (Camera 2)</a>}
                                            <Divider />
                                            <ContactForm
                                                id={"classroom-page-contact-form-" + c.classroomDetails.calloutBox.title}
                                                name={"classroom-page-contact-form-" + c.classroomDetails.calloutBox.title}
                                                location={c.classroomDetails.calloutBox.title}
                                                className="contact-form-wrapper-classroom-cta"
                                            />
                                        </CalloutBox>
                                    </div>
                                </div>
                                <div className="classroom-details-right-col">
                                    <div className="wrapper-classroom-details">
                                        <h1>{c.classroomDetails.mainContent.title}</h1>
                                        <p>{c.classroomDetails.mainContent.content}</p>
                                        <ul>
                                            {mainContentList}
                                        </ul>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            <div className="container-fluid container-fluid-no-padding">
                                <div className="teacher-bio-classroom-wrapper">
                                    <div className="container container-no-padding">
                                        <h1>{c.boxCalloutSection.title}</h1>
                                    </div>

                                    <BoxCalloutSection className="box-callout-section-classroom" height="100%">
                                        {calloutBoxList}
                                    </BoxCalloutSection>
                                </div>
                            </div>
                        </ClassroomDetails>
                        <ClassroomGallery images={c.gallery.images}>
                            <div className="container container-no-padding">
                                <h1>{c.gallery.title}</h1>
                            </div>
                        </ClassroomGallery>
                    </TopHeroLayout>;
            }
        }
        return (html);
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
})(ClassroomPage);