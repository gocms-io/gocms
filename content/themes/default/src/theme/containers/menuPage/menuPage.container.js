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

            let tableAry = [];

            for (let i = 0; i < c.menu.length; i++) {
                let m = c.menu[i];
                // mobile
                if (this.state.screenType === "mobile") {
                    tableAry.push(
                        <div key={i}>
                            <h3>{m.name}</h3>
                            <BasicTable className="menu-page-basic-table menu-page-basic-table-mobile" rows={m.rows}
                                        mobile="true"/>
                        </div>
                    )
                }
                // desktop
                else {
                    tableAry.push(
                        <div key={i}>
                            <h3>{m.name}</h3>
                            <BasicTable className="menu-page-basic-table" rows={m.rows}/>
                        </div>
                    )
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
                        </div>

                        <div className="container">
                            <div className="menu-page-top-wrapper">
                                <div className="menu-page-top-content menu-page-top-content-mobile"
                                     dangerouslySetInnerHTML={{__html: c.content_raw}}></div>
                                <img className="menu-page-food-pic-mobile" src={c.image.src} alt={c.image.alt} />
                                <a className="btn btn-primary" id="menu-page-download-btn-mobile" href={c.button.fileUrl}
                                   download>{c.button.content}</a>
                                <hr />
                            </div>
                            <div className="menu-page-calendars-wrapper">
                                {tableAry}
                            </div>
                        </div>
                    </TopHeroLayout>;
            }
            // desktop
            else {

                html =
                    <TopHeroWithTitleLayout height={c.topHero.backgroundImage.height}
                                            backgroundImage={c.topHero.backgroundImage.src}
                                            title={c.title}
                    >
                        <div className="container container-no-padding">
                            <div className="menu-page-top-wrapper">
                                <div className="menu-page-top-content"
                                     dangerouslySetInnerHTML={{__html: c.content_raw}}></div>
                                <img src={c.image.src} alt={c.image.alt} width={c.image.width} height={c.image.height}/>
                                <a className="btn btn-primary" id="menu-page-download-btn" href={c.button.fileUrl}
                                   target="_blank">{c.button.content}</a>
                                <hr />
                            </div>
                            <div className="menu-page-calendars-wrapper">
                                {tableAry}
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
})(MenuPage);