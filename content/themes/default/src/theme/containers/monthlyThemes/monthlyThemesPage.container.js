'use strict';

import React from 'react';
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import TopHeroWithTitleLayout from '../../templates/layouts/topHeroWithTitleLayout/TopHeroWithTitleLayout'
import TopHeroLayout from '../../templates/layouts/topHeroLayout/TopHeroLayout'
import CalloutBox from '../../components/calloutBox/CalloutBox'

class MonthlyThemesPage extends React.Component {
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

            let themesAry = [];
            for (let i = 0; i < c.themes.length; i++) {
                let t = c.themes[i];
                let lAry = [];
                for (let j = 0; j < t.list.length; j++) {
                    let l = t.list[j];
                    if (l.type == "bible") {
                        lAry.push(<li key={j} className={l.type}><span className="bold">Bible Story: </span>{l.content}
                        </li>)
                    }
                    else {
                        lAry.push(<li key={j} className={l.type}>{l.content}</li>)
                    }
                }
                // mobile
                if (this.state.screenType === "mobile") {
                    let tHtml =
                        <div className="themes-page-callout-box-mobile-wrapper">
                            <CalloutBox key={i}
                                        className={"themes-page-callout-box themes-page-callout-box-mobile"}>
                                <h2>{t.title}</h2>
                                <img src={t.image.src} alt={t.image.alt}/>
                                <p>{t.description}</p>
                                <ul>{lAry}</ul>
                            </CalloutBox>
                        </div>;
                    themesAry.push(tHtml);
                }
                // desktop
                else {
                    let tHtml =
                        <CalloutBox key={i}
                                    className={"themes-page-callout-box " + ((i + 1) % 3 ? "" : "themes-page-callout-box-right") + ((i + 2) % 3 ? "" : "themes-page-callout-box-middle")}>
                            <h2>{t.title}</h2>
                            <img src={t.image.src} alt={t.image.alt}/>
                            <p>{t.description}</p>
                            <ul>{lAry}</ul>
                        </CalloutBox>;
                    themesAry.push(tHtml);
                }
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
                            <h1>{c.title}</h1>
                            <hr/>
                        </div>
                        <div className="container posts-page-posts-wrapper">
                            {themesAry}
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
                            <div className="themes-page-wrapper">
                                {themesAry}
                            </div>
                        </div>
                    </TopHeroWithTitleLayout>;
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
})(MonthlyThemesPage);