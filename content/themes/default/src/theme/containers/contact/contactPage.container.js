'use strict';

import React from 'react';
import {requestPage} from '../../config/actions/page'
import {connect} from 'react-redux'
import ContactForm from '../../components/contactForm/ContactForm'
import ContactFormAgeRangeInput from './components/contactFormAgeRangeInput/ContactFormAgeRangeInput'
import Accordion from '../../components/accordion/Accordion'
import AccordionSection from '../../components/accordion/AccordionSection'
import TopHeroWithTitleLayout from '../../templates/layouts/topHeroWithTitleLayout/TopHeroWithTitleLayout'
import TopHeroLayout    from '../../templates/layouts/topHeroLayout/TopHeroLayout'
// import GTextArea from 'gocms/base/components/gForm/GTextArea'


class ContactPage extends React.Component {
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
            let positionAry = this.getJobPosts(c.jobsSection);

            // mobile
            if (this.state.screenType === "mobile") {
                html =
                    <TopHeroLayout
                        key="mobile"
                        height={c.topHero.backgroundImage.heightMobile}
                        backgroundImage={c.topHero.backgroundImage.src}>

                        <div className="container container-top-mobile-title-description">
                            <h1>{c.pageTitle}</h1>
                            <hr/>
                            <h2 className="contact-page-content-title">{c.contentTitle}</h2>
                            <p className="contact-page-content">{c.content}</p>
                        </div>
                        <div className="container">



                            <ContactForm
                                className="contact-page-contact-from contact-page-contact-from-mobile"
                                buttonText={c.contactFormBtn}
                                id={"classroom-page-contact-form-" + c.pageTitle}
                                name={"classroom-page-contact-form-" + c.pageTitle}
                                location={c.pageTitle}
                            >

                                <label
                                    className="label label-default contact-form-age-range">Your
                                    Child(s) age
                                    range</label>
                                <ContactFormAgeRangeInput name="Infant"  title="Infant"
                                                          subTitle="6w - 12mo" right="31px"/>
                                <ContactFormAgeRangeInput name="Wobbler" title="Wobbler"
                                                          subTitle="12mo - 18mo" right="35px"/>
                                <ContactFormAgeRangeInput name="Toddler" title="Toddler"
                                                          subTitle="18mo - 24mo" right="26px"/>
                                <ContactFormAgeRangeInput name="Early Preschool"
                                                          title="Early Preschool" subTitle="2yr - 3yr"
                                                          right="13px"/>
                                <ContactFormAgeRangeInput name="Preschool" title="Preschool"
                                                          subTitle="3yr and older"/>
                                <div className="contact-form-message-wrapper">
                                    {/*<GTextArea className="input input-default" id="additional.message" name="additional.Message" label="Message"  required/>*/}
                                </div>

                            </ContactForm>

                        </div>
                        <div className="container contact-page-contact-info">
                            <dl>
                                <dt>Phone</dt>
                                <dd>{c.phone}</dd>
                                <dt>Address</dt>
                                <dd>{c.address}</dd>
                                <dt>Email</dt>
                                <dd>{c.email}</dd>
                            </dl>
                            <hr/>
                        </div>
                        <br/>
                        <div className="container">
                            <h1 className="contact-page-title">{c.jobsSection.title}</h1>
                            <p className="contact-page-content">{c.jobsSection.content}</p>
                            <div className="contact-form-jobs-posting-wrapper">
                                <Accordion>
                                    {positionAry}
                                </Accordion>
                            </div>
                        </div>
                    </TopHeroLayout>
            }
            // desktop
            else {
                html =
                    <TopHeroWithTitleLayout height={c.topHero.backgroundImage.height}
                                            backgroundImage={c.topHero.backgroundImage.src}
                                            title={c.pageTitle}
                                            key="desktop"
                    >
                        <div className="container container-no-padding">
                            <div className="contact-page-content-wrapper">
                                <div className="contact-page-col-left">
                                    <h2 className="contact-page-content-title">{c.contentTitle}</h2>
                                    <p className="contact-page-content">{c.content}</p>
                                    <ContactForm
                                        className="contact-page-contact-from"
                                        buttonText={c.contactFormBtn}
                                        id={"classroom-page-contact-form-" + c.pageTitle}
                                        name={"classroom-page-contact-form-" + c.pageTitle}
                                        location={c.pageTitle}
                                    >
                                        <label className="label label-default contact-form-age-range">Your Child(s) age
                                            range</label>
                                        <div className="contact-us-page-contact-form-age-range-container">
                                            <ContactFormAgeRangeInput name="Infant" title="Infant"
                                                                      subTitle="6w - 12mo"/>
                                            <ContactFormAgeRangeInput name="Wobbler" title="Wobbler"
                                                                      subTitle="12mo - 18mo" left="31px"/>
                                            <ContactFormAgeRangeInput name="Toddler" title="Toddler"
                                                                      subTitle="18mo - 24mo" left="35px"/>
                                            <ContactFormAgeRangeInput name="Early Preschool"
                                                                      title="Early Preschool" subTitle="2yr - 3yr"
                                                                      left="26px"/>
                                            <ContactFormAgeRangeInput name="Preschool"
                                                                      title="Preschool"
                                                                      subTitle="3yr and older" left="13px"/>
                                        </div>
                                        <div className="contact-form-message-wrapper">

                                            {/*<GTextArea className="input input-default" id="additional.message" name="additional.Message" label="Message"  required/>*/}
                                        </div>
                                    </ContactForm>
                                </div>
                                <div className="contact-page-col-right">
                                    <div className="contact-page-contact-info">
                                        <dl>
                                            <dt>Phone</dt>
                                            <dd>{c.phone}</dd>
                                            <dt>Address</dt>
                                            <dd>{c.address}</dd>
                                        </dl>
                                        <dl>
                                            <dt>Email</dt>
                                            <dd>{c.email}</dd>
                                        </dl>
                                    </div>
                                    <div className="contact-page-map-wrapper">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2919.9407402596225!2d-85.4971091841021!3d42.95845320509279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x881851bc853af87b%3A0xbdf929db1d60d271!2sBig+Steps+Little+Feet!5e0!3m2!1sen!2sus!4v1490550243779"
                                            width="451"
                                            height="507"
                                            frameBorder="0"
                                            style={{border: "0"}}
                                            allowFullScreen>
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container container-no-padding">
                            <div className="contact-page-job-title-wrapper">
                                <h1 className="contact-page-title">{c.jobsSection.title}</h1>
                                <hr className="contact-page-break"/>
                                <p className="contact-page-content">{c.jobsSection.content}</p>
                                <div className="contact-form-jobs-posting-wrapper">
                                    <Accordion>
                                        {positionAry}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </TopHeroWithTitleLayout>

                ;
            }
        }

        return (html);
    }

    getJobPosts(jobsSection) {
        let positionAry = [];
        for (let i = 0; i < jobsSection.positions.length; i++) {
            let p = jobsSection.positions[i];
            let pHtml = null;
            // mobile
            if (this.state.screenType === "mobile") {
                pHtml =
                    <AccordionSection key={i + "-mobile"} title={p.title}>
                        <p>{p.description}</p>
                        <a href={p.fileUrl} className="btn btn-primary btn-primary-mobile" target="_blank">Download
                            Application</a>
                    </AccordionSection>;
            }
            // desktop
            else {
                pHtml =
                    <AccordionSection key={i + "-desktop"} title={p.title}>
                        <p>{p.description}</p>
                        <a href={p.fileUrl} className="btn btn-primary" target="_blank">Download Application</a>
                    </AccordionSection>;
            }
            positionAry.push(pHtml);
        }
        return positionAry;
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
})(ContactPage);