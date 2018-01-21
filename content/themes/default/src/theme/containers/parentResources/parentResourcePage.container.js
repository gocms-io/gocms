'use strict';

import React from 'react';
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import TopHeroLayout from '../../templates/layouts/topHeroLayout/TopHeroLayout'
import TopHeroWithTitleLayout from '../../templates/layouts/topHeroWithTitleLayout/TopHeroWithTitleLayout'
import ContactForm from '../../components/contactForm/ContactForm'


class ParentResourcePage extends React.Component {
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
            let postsAry = this.getPosts(c.posts, c.moreButton);


            // mobile
            if (this.state.screenType === "mobile") {
                html =
                    <TopHeroLayout
                        key="mobile"
                        height={c.topHero.backgroundImage.heightMobile}
                        backgroundImage={c.topHero.backgroundImage.src}
                    >
                        <div className="container container-top-mobile-title-description">
                            <h1>{c.title}</h1>
                            <hr/>
                        </div>

                        <div className="container posts-page-posts-wrapper">
                            {postsAry}
                        </div>

                        <hr />
                        <br />
                        <div className="container">
                            <h2>Schedule A Tour</h2>
                            <ContactForm
                                id={"classroom-page-contact-form-"+c.title}
                                name={"classroom-page-contact-form-"+c.title}
                                location={c.title}
                                className="two-column-template-contact-form"
                                buttonText="Schedule a Tour"
                            />
                            <br/>
                        </div>
                    </TopHeroLayout>
            }
            // desktop
            else {
                html =
                    <TopHeroWithTitleLayout height={c.topHero.backgroundImage.height}
                                            backgroundImage={c.topHero.backgroundImage.src}
                                            title={c.title}
                    >
                        <div className="container container-no-padding">
                            <div className="posts-page-wrapper">
                                <div className="posts-page-posts-wrapper">
                                    {postsAry}
                                </div>
                            </div>
                        </div>
                    </TopHeroWithTitleLayout>;
            }
        }

        return (html);
    }

    getPosts(posts, btnName) {
        let postsAry = [];
        for (let i = 0; i < posts.length; i++) {
            let p = posts[i];
            let pHtml = null;
            // mobile
            if (this.state.screenType === "mobile") {
                pHtml =
                    <div className="posts-page-post-wrapper-mobile" key={i+"-mobile"}>
                        <img className="posts-page-post-thumb posts-page-post-thumb-mobile" src={p.thumb.src} alt={p.thumb.alt}/>
                        <h2 className="posts-page-post-name posts-page-post-name-mobile">{p.title}</h2>
                        <h3 className="posts-page-post-date posts-page-post-date-mobile">{p.date}</h3>
                        <p className="posts-page-post-summary posts-page-post-summary-mobile">{p.summary}</p>
                        <a href={p.fileUrl} target="_blank" className="btn btn-primary posts-page-post-btn-mobile">{btnName}</a>
                        {i==(posts.length-1) ? "" : <hr/>}
                    </div>;
            }
            // desktop
            else {
                pHtml =
                    <div className="posts-page-post-wrapper" key={i+"-dekstop"}>
                        <img className="posts-page-post-thumb" src={p.thumb.src} alt={p.thumb.alt}/>
                        <h2 className="posts-page-post-name">{p.title}</h2>
                        <h3 className="posts-page-post-date">{p.date}</h3>
                        <p className="posts-page-post-summary">{p.summary}</p>
                        <a href={p.fileUrl} target="_blank" className="btn btn-primary posts-page-post-btn">{btnName}</a>
                    </div>;
            }
            postsAry.push(pHtml);
        }
        return postsAry;
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
})(ParentResourcePage);