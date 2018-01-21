'use strict';

import React from 'react';
import {connect} from 'react-redux'
import ImageGallery from 'react-image-gallery';


class ClassroomGallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }



    componentDidMount() {
    }

    render() {
        let html = null;

        for (var i=0; i<this.props.images.length; i++) {
            this.props.images[i].originalClass = "classroom-gallery-primary-image";
            this.props.images[i].thumbnailClass = "classroom-gallery-thumb-image";
        }

        // mobile
        if (this.props.mobile) {
            html =
                <div className={"classroom-gallery-wrapper " + this.props.className}>
                    {this.props.children}
                    <div className="container container-no-padding">
                        <div className="classroom-image-gallery-wrapper">
                            <ImageGallery
                                items={this.props.images}
                                showtrue={false}
                                showPlayButton={false}
                                showThumbnails={false}
                                showBullets={true}
                            />
                        </div>
                    </div>
                </div>
        }
        //desktop
        else {
            html =
            <div className={"classroom-gallery-wrapper " + this.props.className}>
                {this.props.children}
                <div className="container container-no-padding">
                    <div className="classroom-image-gallery-wrapper">
                        <ImageGallery
                            items={this.props.images}
                            showNav={false}
                            showPlayButton={false}

                        />
                    </div>
                </div>
            </div>
        }



        return (html);
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(ClassroomGallery);