'use strict';

import React from 'react';
import BoxCalloutSection from '../../components/boxCalloutSection/BoxCalloutSection'
import CalloutBox from '../../components/calloutBox/CalloutBox'
import VideoThumb from '../../components/videoThumb/VideoThumb'
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import TopHeroLayout from '../../templates/layouts/topHeroLayout/TopHeroLayout'
import HeroImage from '../../components/heroImage/HeroImage'


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
            let videoThumbsAry = this.getVideoThumbs(c.videoSection.videos);

            let managementBoxCalloutSectionList = [];
            for (let j = 0; j < c.managementBoxCalloutSection.boxes.length; j++) {
                let cb = c.managementBoxCalloutSection.boxes[j];
                managementBoxCalloutSectionList.push(
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
                    <TopHeroLayout key="mobile"
                                   height={c.topHero.backgroundImage.heightMobile}
                                   backgroundImage={c.topHero.backgroundImage.src}>
                        <HeroImage height="auto" backgroundImage="/themes/bslf/img/home/hero-pattern-bg.png"
                                   backgroundColor="#2CAFC1" backgroundSize="auto 250px" backgroundRepeat="repeat">
                            <div className="container">
                                <div className="about-mission-statement-wrapper about-mission-statement-wrapper-mobile">
                                    <h1>{c.missionStatement.title}</h1>
                                    <hr/>
                                    <p>{c.missionStatement.content}</p>
                                </div>
                            </div>
                        </HeroImage>
                        <HeroImage height={c.heroTwo.backgroundImage.heightMobile}
                                   backgroundImage={c.heroTwo.backgroundImage.src}>
                        </HeroImage>
                        <BoxCalloutSection className="three-box-callout-about three-box-callout-about-mobile"
                                           backgroundRepeat="no-repeat"
                                           backgroundColor="none">
                            <CalloutBox
                                className="three-box-callout-box three-box-callout-box-left three-box-callout-box-about">
                                <h2>{c.boxCalloutSection.box1.title}</h2>
                                <p>{c.boxCalloutSection.box1.content}</p>
                            </CalloutBox>
                            <CalloutBox
                                className="three-box-callout-box three-box-callout-box-center three-box-callout-box-about">
                                <h2>{c.boxCalloutSection.box2.title}</h2>
                                <p>{c.boxCalloutSection.box2.content}</p>
                            </CalloutBox>
                            <CalloutBox
                                className="three-box-callout-box three-box-callout-box-right three-box-callout-box-about">
                                <h2>{c.boxCalloutSection.box3.title}</h2>
                                <p>{c.boxCalloutSection.box3.content}</p>
                            </CalloutBox>
                        </BoxCalloutSection>
                        <div className="container about-facility-container about-facility-container-mobile">
                            <h1>{c.facilityInfo.title}</h1>
                            <hr/>
                            <p>{c.facilityInfo.content}</p>
                            <img src={c.facilityInfo.image.src} style={{maxHeight: c.facilityInfo.image.height}}
                                 alt={c.facilityInfo.image.alt}/>
                        </div>
                        <div
                            className="container-fluid container-fluid-no-padding container-box-callout-section-about-management container-box-callout-section-about-management-mobile">
                            <div className="container">
                                <h1>{c.managementBoxCalloutSection.title}</h1>
                                <hr/>
                            </div>
                            <BoxCalloutSection
                                className="box-callout-section-about-management box-callout-section-about-management-mobile"
                                height="800">
                                {managementBoxCalloutSectionList}
                            </BoxCalloutSection>

                            <BoxCalloutSection height="100%" className="box-callout-section-about-management-rob-mobile">
                                {[
                                    <CalloutBox
                                        key="about-rob-desktop" className="callout-box-about-rob-mobile">
                                        <h2>{c.managementBoxCalloutSection.owner.title}</h2>
                                        <img src={c.managementBoxCalloutSection.owner.image.src} alt={c.managementBoxCalloutSection.owner.image.alt}/>
                                        <div dangerouslySetInnerHTML={{__html:c.managementBoxCalloutSection.owner.copy}}/>
                                    </CalloutBox>
                                ]}
                            </BoxCalloutSection>
                        </div>
                        <br/>
                        <div className="container about-video-container about-video-container-mobile">
                            <h1>{c.videoSection.title}</h1>
                            <hr/>
                            <div className="about-video-thumbs-container about-video-thumbs-container-mobile">
                                {videoThumbsAry}
                            </div>
                        </div>
                    </TopHeroLayout>
                ;
            }
            // desktop
            else {
                html =
                    <TopHeroLayout key="desktop"
                                   height={c.topHero.backgroundImage.height}
                                   backgroundImage={c.topHero.backgroundImage.src}>
                        <HeroImage height="554px" backgroundImage="/themes/bslf/img/home/hero-pattern-bg.png"
                                   backgroundColor="#2CAFC1" backgroundSize="auto 329px" backgroundRepeat="repeat">
                            <div className="about-mission-statement-wrapper">
                                <h1>{c.missionStatement.title}</h1>
                                <hr/>
                                <p>{c.missionStatement.content}</p>
                            </div>
                        </HeroImage>
                        <HeroImage height={c.heroTwo.backgroundImage.height}
                                   backgroundImage={c.heroTwo.backgroundImage.src}>
                        </HeroImage>
                        <BoxCalloutSection className="three-box-callout-about" backgroundRepeat="no-repeat"
                                           backgroundColor="none">
                            <CalloutBox
                                className="three-box-callout-box three-box-callout-box-left three-box-callout-box-about">
                                <h2>{c.boxCalloutSection.box1.title}</h2>
                                <p>{c.boxCalloutSection.box1.content}</p>
                            </CalloutBox>
                            <CalloutBox
                                className="three-box-callout-box three-box-callout-box-center three-box-callout-box-about">
                                <h2>{c.boxCalloutSection.box2.title}</h2>
                                <p>{c.boxCalloutSection.box2.content}</p>
                            </CalloutBox>
                            <CalloutBox
                                className="three-box-callout-box three-box-callout-box-right three-box-callout-box-about">
                                <h2>{c.boxCalloutSection.box3.title}</h2>
                                <p>{c.boxCalloutSection.box3.content}</p>
                            </CalloutBox>
                        </BoxCalloutSection>
                        <div className="container container-no-padding about-facility-container">
                            <h1>{c.facilityInfo.title}</h1>
                            <hr/>
                            <p>{c.facilityInfo.content}</p>
                            <img src={c.facilityInfo.image.src} style={{height: c.facilityInfo.image.height}}
                                 alt={c.facilityInfo.image.alt}/>
                        </div>
                        <div
                            className="container-fluid container-fluid-no-padding container-box-callout-section-about-management">
                            <div className="container container-no-padding">
                                <h1>{c.managementBoxCalloutSection.title}</h1>
                                <hr/>
                            </div>
                            <BoxCalloutSection className="box-callout-section-about-management" height="380px">
                                {managementBoxCalloutSectionList}
                            </BoxCalloutSection>
                            <BoxCalloutSection height="350px" className="box-callout-section-about-management-rob">
                                {[
                                    <CalloutBox
                                    key="about-rob-desktop" className="callout-box-about-rob">
                                        <h2>{c.managementBoxCalloutSection.owner.title}</h2>
                                        <img src={c.managementBoxCalloutSection.owner.image.src} alt={c.managementBoxCalloutSection.owner.image.alt}/>
                                        <div dangerouslySetInnerHTML={{__html:c.managementBoxCalloutSection.owner.copy}}/>
                                    </CalloutBox>
                                ]}
                            </BoxCalloutSection>
                        </div>
                        <div className="container container-no-padding about-video-container">
                            <h1>{c.videoSection.title}</h1>
                            <hr/>
                            <div className="about-video-thumbs-container">
                                {videoThumbsAry}
                            </div>
                        </div>
                    </TopHeroLayout>;
            }
        }
        return (html);
    }


    getVideoThumbs(videoThumbs) {
        let videoThumbsAry = [];
        for (let i = 0; i < videoThumbs.length; i++) {
            // left or right
            let side = "left";
            if (i % 2) {
                side = "right";
            }
            let thumb = null;

            // mobile
            if (this.state.screenType === "mobile") {
                thumb =
                    <VideoThumb
                        className="about-page-video-thumb about-page-video-thumb-mobile video-thumb video-thumb-mobile"
                        key={i + "-mobile"}
                        title={videoThumbs[i].title} description={videoThumbs[i].description}
                        videoId={videoThumbs[i].videoId}
                        responsive="true"
                    />
            }
            // desktop
            else {
                thumb =
                    <VideoThumb className={'about-page-video-thumb video-thumb-' + side}
                                key={i + "-desktop"}
                                title={videoThumbs[i].title} description={videoThumbs[i].description}
                                videoId={videoThumbs[i].videoId}/>
            }
            videoThumbsAry.push(thumb);
        }
        return videoThumbsAry;
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
})(HomePage);