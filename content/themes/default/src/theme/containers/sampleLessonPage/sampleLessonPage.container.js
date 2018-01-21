'use strict';

import React from 'react';
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import TopHeroWithTitleLayout from '../../templates/layouts/topHeroWithTitleLayout/TopHeroWithTitleLayout'
import BasicTable from '../../components/basicTable/BasicTable'
import TopHeroLayout from '../../templates/layouts/topHeroLayout/TopHeroLayout'

class MenuPage extends React.Component {
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

            let plans = [];
            for (let i = 0; i < c.plans.length; i++) {
                let plan = c.plans[i];
                let planHtml = this.getPlan(plan, i);
                plans.push(planHtml);
            }

            // mobile
            if (this.state.screenType === "mobile") {
                html =
                    <TopHeroLayout
                        key="mobile"
                        height={c.topHero.backgroundImage.heightMobile}
                        backgroundImage={c.topHero.backgroundImage.src}
                    >
                        <div className="container container-top-mobile-title-description">
                            <h1>{c.pageTitle}</h1>
                        </div>
                        {plans}
                    </TopHeroLayout>;
            }
            // desktop
            else {
                html =
                    <TopHeroWithTitleLayout height={c.topHero.backgroundImage.height}
                                            backgroundImage={c.topHero.backgroundImage.src}
                                            title={c.pageTitle}
                                            key="desktop"
                    >
                        {plans}
                    </TopHeroWithTitleLayout>;
            }
        }
        return (html);
    }

    getPlan(plan, key) {
        let detailsAry = this.getDetails(plan.lessonDetails);

        // mobile
        if (this.state.screenType === "mobile") {
            return (
                <div className="container" key={"mobile-plan-"+key}>
                    <div className="sample-lesson-page-top-content
                            sample-lesson-page-top-content-mobile">
                        <h2 className="sample-lesson-page-lesson-title-mobile">{plan.title}</h2>
                        {detailsAry}
                        <h3 className="sample-lesson-bible-story-mobile">{plan.bibleStory}</h3>
                        <hr/>
                        <BasicTable className="lesson-plan-page-basic-table lesson-plan-page-basic-table-mobile" rows={plan.lessons} mobile="true"/>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
            )
        }
        // desktop
        else {
            return (
            <div className="container container-no-padding" key={"plan-"+key}>
                <div className="menu-page-top-wrapper">
                    <div className="sample-lesson-page-top-content">
                        <h2 className="sample-lesson-page-lesson-title">{plan.title}</h2>
                        {detailsAry}
                    </div>
                </div>
                <div className="sample-lesson-page-table-wrapper">
                    <BasicTable className="lesson-plan-page-basic-table" rows={plan.lessons}/>
                </div>
                <h3 className="sample-lesson-bible-story">{plan.bibleStory}</h3>
                <br/><br/><br/><br/>
            </div>
            );
        }

    }

    getDetails(lessonDetails) {
        let detailsAry = [];

        for (let i = 0; i < lessonDetails.length; i++) {
            let details = null;
            // mobile
            if (this.state.screenType === "mobile") {
                details =
                    <div key={i + "-mobile"} className="sample-lesson-details sample-lesson-details-mobile">
                        <h3>{lessonDetails[i].title}</h3>
                        <h4>{lessonDetails[i].subTitle}</h4>
                    </div>;
            }
            // desktop
            else {
                details =
                    <div key={i + "-desktop"} className="sample-lesson-details">
                        <h3>{lessonDetails[i].title}</h3>
                        <h4>{lessonDetails[i].subTitle}</h4>
                    </div>;
            }
            detailsAry.push(details);
        }
        return detailsAry;
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
})(MenuPage);