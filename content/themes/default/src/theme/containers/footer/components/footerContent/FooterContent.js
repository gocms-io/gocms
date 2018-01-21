'use strict';

import React from 'react';
import {Link} from 'react-router';

class FooterContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screenType: this.props.screenType
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.screenType !== this.state.screenType) {
            this.setState({screenType: nextProps.screenType});
        }
    }

    render() {

        let html = null;

        if (this.state.screenType === "mobile") {
            html =
                <div className="container-fluid container-fluid-no-padding">
                    <div className="wrapper-mobile-footer">
                        <h3><Link className="footer-h3-link" to="/about">About Us</Link></h3>
                        <hr />
                        <h3 className="footer-h3-top-margin-helper"><Link className="footer-h3-link"
                                                                          to="/videos">Videos</Link></h3>
                        <hr />
                        <h3 className="footer-h3-top-margin-helper"><Link className="footer-h3-link"
                                                                          to="/parent-resources">Parent Resources</Link>
                        </h3>
                        <hr />
                        <h3 className="footer-h3-top-margin-helper"><Link className="footer-h3-link"
                                                                          to="/contact-us">Contact</Link>
                        </h3>
                        <hr/>
                        <h5>Phone: (616) 682-8300</h5>
                        <h5 className="footer-h5-top-margin-helper">Email: info@bigstepslittlefeet.org</h5>
                        <h5 className="footer-h5-top-margin-helper">Address: 7030 Fulton St. Ada, MI 49301 <a
                            href="https://www.google.com/maps?ll=42.958449,-85.49492&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=13689018563436794481"
                            target="_blank">MAP IT</a></h5>
                        <div className="footer-email-signup-wrapper">
                            <a className="btn btn-primary full-width" href="http://eepurl.com/cWoOcf" target="_blank">Newsletter Sign Up</a>
                        </div>
                        <div className="footer-ss-wrapper">
                            <a className="footer-ss-facebook"
                               href="https://www.facebook.com/Big-Steps-Little-Feet-Preschool-and-Childcare-111408292214784"
                               target="_blank"><i className="icon-facebook"/></a>
                        </div>
                    </div>
                </div>
        }
        else {
            html =
                <div className="container-fluid container-fluid-no-padding">
                    <div className="footer-content-wrapper container">
                        <div className="footer-col footer-col-left">
                            <h3><Link className="footer-h3-link" to="/about">About Us</Link></h3>
                            <hr />
                            <h3 className="footer-h3-top-margin-helper"><Link className="footer-h3-link" to="/videos">Videos</Link>
                            </h3>
                            <hr />
                            <h3 className="footer-h3-top-margin-helper"><Link className="footer-h3-link"
                                                                              to="/parent-resources">Parent
                                Resources</Link></h3>
                            <hr />
                            <div className="footer-ss-wrapper">
                                <a className="footer-ss-facebook"
                                   href="https://www.facebook.com/Big-Steps-Little-Feet-Preschool-and-Childcare-111408292214784"
                                   target="_blank"><i className="icon-facebook"/></a>
                            </div>

                        </div>
                        <div className="footer-col footer-col-center">
                            <h3>Programs</h3>
                            <hr/>
                            <div className="row">
                                <div className="col-md-6 col-no-padding">
                                    <Link to="/classes/lovable-lambs" className="footer-link footer-link-first">Lovable
                                        Lambs (6w to 5m)</Link>
                                    <Link to="/classes/gentle-giraffes" className="footer-link">Gentle Giraffes (5m to
                                        13m)</Link>
                                    <Link to="/classes/curious-critters" className="footer-link">Curious Critters (13m
                                        to 18m)</Link>
                                    <Link to="/classes/helpful-hippos" className="footer-link">Helpful Hippos (18m to
                                        22m)</Link>
                                    <Link to="/classes/kindhearted-kangaroos" className="footer-link">Kindhearted
                                        Kangaroos (22m to
                                        24m)</Link>
                                    <Link to="/classes/enthusiastic-elephants" className="footer-link">Enthusiastic Elephants (24m
                                        to 27m)</Link>
                                    <Link to="/classes/cheerful-chipmunks" className="footer-link">Cheerful Chipmunks
                                        (2.5yrs to
                                        3yrs)</Link>
                                </div>
                                <div className="col-md-6 col-no-padding">
                                    <Link to="/classes/trustworthy-turtles" className="footer-link footer-link-first">Trustworthy Turtles
                                        (3yrs to
                                        3.5yrs)</Link>
                                    <Link to="/classes/courageous-cubs" className="footer-link">Courageous
                                        Cubs (3.5yrs to 4yrs)</Link>
                                    <Link to="/classes/joyful-jaguars" className="footer-link">Joyful Jaguars (3.5yrs to
                                        4yrs)</Link>
                                    <Link to="/classes/patient-penguins" className="footer-link">Patient Penguins
                                        (3.5yrs to
                                        4yrs)</Link>
                                    <Link to="/classes/friendly-frogs" className="footer-link">Friendly Frogs (4yrs to
                                        5yrs)</Link>
                                    <Link to="/classes/responsible-raccoons" className="footer-link">Responsible
                                        Raccoons (5yrs to
                                        6yrs)</Link>
                                    <Link to="/tuition" className="footer-link">Tuition</Link>
                                </div>
                            </div>
                            <div className="footer-email-signup-wrapper">
                                <a className="btn btn-primary" href="http://eepurl.com/cWoOcf" target="_blank">Newsletter Sign Up</a>
                            </div>
                        </div>
                        <div className="footer-col footer-col-right">
                            <h3><Link className="footer-h3-link" to="/contact-us">Contact</Link></h3>
                            <hr/>
                            <h5>Phone: (616) 682-8300</h5>
                            <h5 className="footer-h5-top-margin-helper">Email: info@bigstepslittlefeet.org</h5>
                            <h5 className="footer-h5-top-margin-helper">Address: 7030 Fulton St. Ada, MI 49301</h5>
                            <div className="footer-map-wrapper">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2919.9407402596225!2d-85.4971091841021!3d42.95845320509279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x881851bc853af87b%3A0xbdf929db1d60d271!2sBig+Steps+Little+Feet!5e0!3m2!1sen!2sus!4v1490550243779"
                                    width="358"
                                    height="183"
                                    frameBorder="0"
                                    style={{border: "0"}}
                                    allowFullScreen>
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
        }

        return (html);
    }


}

export default FooterContent;