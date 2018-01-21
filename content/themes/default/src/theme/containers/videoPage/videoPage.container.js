'use strict';

import React from 'react';
import VideoThumb from '../../components/videoThumb/VideoThumb'
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import TopHeroLayout from '../../templates/layouts/topHeroLayout/TopHeroLayout'
import TwoColumnLayout from '../../templates/layouts/twoColumnLayout/TwoColumnLayout'
import ContactForm from '../../components/contactForm/ContactForm'

class VideoPage extends React.Component {
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
            let videoAry = this.getVideoThumbs(c.videos);


            // mobile
            if (this.state.screenType === "mobile") {
                html =
                    <TopHeroLayout
                        key="mobile"
                        height={c.topHero.backgroundImage.heightMobile}
                        backgroundImage={c.topHero.backgroundImage.src}>

                        <div className="container container-top-mobile-title-description">
                            <h1>{c.videosTitle}</h1>
                            <p>{c.videosContent}</p>
                            <hr/>
                        </div>

                        <div className="container">
                            <h2>Schedule A Tour</h2>
                            <ContactForm
                                id={"classroom-page-contact-form-" + c.videosTitle}
                                name={"classroom-page-contact-form-" + c.videosTitle}
                                location={c.videosTitle}
                                className="two-column-template-contact-form"
                                buttonText="Schedule a Tour"
                            />
                            <br/>
                            <hr />
                        </div>

                        <div className="container">
                            {videoAry}
                        </div>

                    </TopHeroLayout>
            }
            // desktop
            else {

                html =
                    <TwoColumnLayout
                        key="desktop"
                        topHero={{
                            backgroundImage: {
                                height: c.topHero.backgroundImage.height,
                                backgroundImage: c.topHero.backgroundImage.src
                            }
                        }}
                        leftColumnTitle={c.videosTitle}
                        leftColumnContent={c.videosContent}
                    >
                        {videoAry}
                    </TwoColumnLayout>
                ;
            }
        }

        return (html);
    }

    getVideoThumbs(videoThumbs) {
        let videoThumbsAry = [];

        for (let i = 0; i < videoThumbs.length; i++) {
            let v = videoThumbs[i];
            let vHtml = null;

            // mobile
            if (this.state.screenType === "mobile") {

                vHtml =
                    <div className="video-page-video-wrapper video-page-video-wrapper-mobile"
                         key={i + "-mobile"}>
                        <VideoThumb youtubeClassName="video-page-video-container"
                                    responsive="true"
                                    title={v.title} description={v.description}
                                    videoId={v.videoId}/>
                    </div>;
            }
            // desktop
            else {
                vHtml =
                    <div className="video-page-video-wrapper" key={i + "-desktop"}>
                        <VideoThumb youtubeClassName="video-page-video-container" width="600" height="338"
                                    title={v.title} description={v.description}
                                    videoId={v.videoId}/>
                    </div>;
            }
            videoThumbsAry.push(vHtml);
        }

        return videoThumbsAry
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
})(VideoPage);