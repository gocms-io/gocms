import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class GError extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errMessage: this.props.errMessage || null,
            size: this.props.size || "20px",
            color: this.props.color || "#006797",
            margin: this.props.margin || "0 2%"
        };

        this.style = {
            width: this.state.size,
            height: this.state.size,
            backgroundColor: this.state.color,
            margin: this.state.margin
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.errMessage) {
            this.setState({errMessage: nextProps.errMessage})
        }
    }

    render() {
        return (
            <div className="busy-loader-wrapper">
                <div className="busy-loader busy-loader-1" style={this.style}/>
                <div className="busy-loader busy-loader-2" style={this.style}/>
                <div className="busy-loader busy-loader-3" style={this.style}/>
            </div>
        );
    }

}
export default GError;


