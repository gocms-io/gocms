'use strict';

import React from 'react';
import {connect} from 'react-redux'
// import GInput from 'gocms/base/components/gForm/GInput'



class ContactFormAgeRangeInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            checked: value
        });
    }

    componentDidMount() {
    }

    render() {
        return (
                <div className={"contact-from-age-range-input-wrapper " + this.props.className} style={{"marginLeft": this.props.left, "marginRight": this.props.right}}>
                    {/*<GInput className="input input-default" type="checkbox" name={this.state.checked ? "additional."+this.props.name : "ignore.agerange"} value={this.state.checked ? "yes" : "no"} onChange={this.handleChange} />*/}
                    <h4>{this.props.title}</h4>
                    <h5>{this.props.subTitle}</h5>
                </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(ContactFormAgeRangeInput);