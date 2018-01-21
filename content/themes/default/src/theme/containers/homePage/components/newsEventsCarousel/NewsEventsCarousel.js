'use strict';

import React from 'react';
import {connect} from 'react-redux'
import Slider from 'react-slick'

class NewsEventsCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                dots: true,
                dotsClass: 'news-events-carousel-dots',
                speed: 500,
                slidesToShow: this.props.mobile ? 1 : 2.3,
                slidesToScroll: 1,
                initialSlide: 0,
                focusOnSelect: true,
                infinite: false,
                arrows: false
            }
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="container-fluid container-fluid-no-padding">
                <div className="news-events-carousel-wrapper">
                    <div className="container container-no-padding">
                        <h1 className="news-events-carousel-title">News and Events</h1>
                        <div className="news-events-carousel-slider-wrapper">
                            <Slider {...this.state.settings }>
                                {this.props.children}
                            </Slider>
                        </div>
                        <div className="news-events-carousel-slider-wrapper-gradient hidden-sm hidden-xs">

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(NewsEventsCarousel);