import React from 'react';
import R from 'ramda';

import Menu from './menu';

export default React.createClass({

    displayName: 'Main',

    getInitialState() {
        return {
            screenData: {
                pixelData: [],
                resolution: {
                    x: 0,
                    y: 0,
                },
                brightness: 0,
                maxBrightness: 0,
            },
            loading: true,
        };
    },

    componentWillMount() {
        this.socket = io();
        this.socket.on('init', this.onInit);
        this.socket.on('afterDraw', this.afterDraw);
        this.socket.on('afterBrightness', this.afterBrightness);
        this.socket.on('afterReset', this.afterReset);
        this.socket.on('afterImage', this.afterImage);
    },

    onInit(screenData) {
        this.setState({
            loading: false,
            screenData,
        });

    },

    afterImage(screenData) {
        this.setState({
            screenData,
        });
    },

    afterBrightness(brightness) {
        let oldBrightness = this.state.screenData.brightness;

        if (oldBrightness === brightness) {
            return;
        }

        const screenData = {
            ...this.state.screenData,
            brightness,
        };

        this.setState({
            screenData,
        });
    },

    afterDraw({coordinates, color}) {

        const {x, y} = coordinates;

        let pixelData = this.state.screenData.pixelData;

        if (pixelData[y][x] === color) {
            return;
        }

        pixelData[y][x] = color;

        const screenData = {
            ...this.state.screenData,
            pixelData,
        };

        this.setState({
            screenData,
        });
    },

    afterReset(screenData) {
        this.setState(screenData);
    },

    onReset() {

        const { screenData } = this.state;

        const setAllElementsToZero = R.pipe(
            R.flatten,
            R.map(R.always(0)),
            R.splitEvery(this.state.screenData.resolution.x)
        );

        this.setState({
            screenData: {
                ...screenData,
                pixelData: setAllElementsToZero(screenData.pixelData)
            },
        });

        this.socket.emit('reset');
    },

    onDraw({coordinates, color}) {

        const {x, y} = coordinates;
        let pixelData = this.state.screenData.pixelData;
        pixelData[y][x] = color;

        const screenData = {
            ...this.state.screenData,
            pixelData,
        };

        this.socket.emit('draw', {coordinates: {x, y}, color});

        this.setState({
            screenData
        });
    },

    onUploadImage({ file, name }) {
        this.socket.emit('imageUpload', { file, name });
    },

    onChangeBrightness(brightness) {
        const screenData = {
            ...this.state.screenData,
            brightness,
        };

        this.socket.emit('brightness', brightness);

        this.setState({
            screenData,
        });
    },

    onOpenClock() {
        this.socket.emit('openClock');
    },

    render() {

        const childrenWithProps = React.Children.map(
            this.props.children,
            (child) => React.cloneElement(child, {
                ...this.state,
                onDraw: this.onDraw,
                onUploadImage: this.onUploadImage,
                onOpenClock: this.onOpenClock,
            })
        );

        return (
            <div>
                <Menu { ...this.state } onReset={ this.onReset } onChangeBrightness={ this.onChangeBrightness }/>
                    <div className="flex-container">
                        { childrenWithProps }
                    </div>

            </div>
        );
    },
});

