'use strict';

import React from 'react';
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import YouTube from 'react-youtube'


class VideoThumb extends React.Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this); //bind function once
        this.state = {
            opts: {
                height: this.props.height || 262, // 262
                width: this.props.width || 465, // 465
                playerVars: { // https://developers.google.com/youtube/player_parameters
                    autoplay: 0,
                    frameborder: 0,
                    allowFullScreen: 1,
                    rel: 0,
                    modestbranding: 1,
                    showinfo: 0
                }
            }
        };
    }

    getWidth() {
        let w = ReactDOM.findDOMNode(this).getBoundingClientRect().width;
        // if there is padding we need to adjust for it
        return w;
    }

    getHeight() {
        let w = ReactDOM.findDOMNode(this).getBoundingClientRect().width;
        let h = (w * 9) / 16;
        return h;
    }

    handleResize(e) {
        if (!!this.props.responsive) {
            let containerWidth = ReactDOM.findDOMNode(this).getBoundingClientRect().width;
            if (containerWidth != this.state.containerWidth) {
                let newOpts = this.state.opts;
                newOpts.width = this.getWidth();
                newOpts.height = this.getHeight();
                this.setState({
                    containerWidth: containerWidth,
                    opts: newOpts
                });
            }
        }
    }


    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        let video = null;

        if (!!this.props.responsive) {
            if (!!this.state.containerWidth) {
                video =
                    <YouTube
                        videoId={this.props.videoId}
                        opts={this.state.opts}
                    />
            }
        }
        else {
            video =
                <YouTube
                    videoId={this.props.videoId}
                    opts={this.state.opts}
                />
        }


        return (
            <div
                key={this.state.width + "=" + this.props.videoId}
                className={"video-thumb-wrapper " + this.props.className}>
                <div className="video-wrapper">
                    {video}
                </div>
                <h2 className="video-thumb-title">{this.props.title}</h2>
                <p className="video-thumb-description">{this.props.description}</p>
            </div>
        );
    }


}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(VideoThumb);