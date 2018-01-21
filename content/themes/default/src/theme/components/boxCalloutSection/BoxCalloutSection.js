'use strict';

import React from 'react';
import {connect} from 'react-redux'
import HeroImage from '../heroImage/HeroImage'


class BoxCalloutSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundImage: props.backgroundImage || "/themes/bslf/img/home/hero-pattern-bg.png",
            backgroundRepeat: props.backgroundRepeat || "repeat",
            backgroundColor: props.backgroundColor || "#2CAFC1",
            backgroundSize: props.backgroundSize || "auto 329px",
            height: props.height || "329px"
        };
    }

    componentDidMount() {
    }

    render() {

        let html = this.getBoxesLayout(this.props.children);

        return (
            <div className={"box-callout-container " + (this.props.className || "")}>
                <HeroImage height={this.state.height} backgroundImage={this.state.backgroundImage}
                           backgroundColor={this.state.backgroundColor} backgroundSize={this.state.backgroundSize}
                           backgroundRepeat={this.state.backgroundRepeat}>
                    <div className='box-callout-section-wrapper container container-no-padding'>
                        {html}
                    </div>
                </HeroImage>
            </div>
        );
    }

    getBoxesLayout(boxes) {
        let rows = [];
        let rowCount = Math.ceil(boxes.length/3);
        for (let i = 0; i < rowCount ; i++) {
            let colCount = boxes.length - (3 * i);
            let rowHtml =(
            <div className={"box-callout-section-row box-callout-section-row-" + colCount} key={"box-callout-section-row-" + i + "-" + colCount}>
                {colCount >= 1 ? boxes[(3*i)] : ""}
                {colCount >= 2 ? boxes[((3*i)+1)] : ""}
                {colCount >= 3 ? boxes[((3*i)+2)] : ""}
            </div>);
            rows.push(rowHtml)
        }

        return rows;
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(BoxCalloutSection);