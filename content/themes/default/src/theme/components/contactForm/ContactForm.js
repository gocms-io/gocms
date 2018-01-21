'use strict';

import React from 'react';
import {connect} from 'react-redux';
// import ContactForm from 'contact-form.plugins.gocms.io/public/ContactForm'
// import GHidden from 'gocms/base/components/gForm/GHidden'


class HeroImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: this.props.buttonText || "Send Request"
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let partialState = {};
        partialState[name] = value;
        this.setState(partialState);
    }


    componentDidMount() {
    }

    render() {
        return (
                <div className={"contact-form-wrapper " + (this.props.className || '')}>
                    {/*<ContactForm*/}
                        {/*id={this.props.id}*/}
                        {/*name={this.props.name}*/}
                        {/*className="bslf-form"*/}
                        {/*nameLabel="Your Name"*/}
                        {/*emailLabel="Email"*/}
                        {/*submitBtnLabel={this.state.buttonText}*/}
                        {/*submitBtnClassName="btn-primary"*/}
                        {/*successMsg="<h4>Your request has been sent.</h4>"*/}
                    {/*>*/}
                        {/*<GHidden name="additional.Location" value={this.props.location} />*/}
                        {/*{this.props.children}*/}
                    {/*</ContactForm>*/}

                </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(HeroImage);