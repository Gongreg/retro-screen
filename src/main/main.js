import React from 'react';
import R from 'ramda';

import Menu from './menu';

function parseScreenData(screenData) {

    return {
        screenData: {
            ...screenData,
            pixelData: R.values(screenData.pixelData),
        },
    };
}

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
    },

    onInit(screenData) {
        this.setState({
            loading: false,
            ...parseScreenData(screenData),
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

    afterDraw({index, color}) {
        let pixelData = this.state.screenData.pixelData;

        if (pixelData[index] === color) {
            return;
        }

        pixelData[index] = color;

        const screenData = {
            ...this.state.screenData,
            pixelData,
        };

        this.setState({
            screenData,
        });
    },

    afterReset(screenData) {
        this.setState(parseScreenData(screenData));
    },

    onReset() {

        const { screenData } = this.state;

        this.setState({
            screenData: {
                ...screenData,
                pixelData: R.map(R.always(0), screenData.pixelData)
            },
        });

        this.socket.emit('reset');
    },

    onDraw({index, color}) {

        let pixelData = this.state.screenData.pixelData;
        pixelData[index] = color;

        const screenData = {
            ...this.state.screenData,
            pixelData,
        };

        this.socket.emit('draw', {index, color});

        this.setState({
            screenData
        });
    },

    render() {

        const childrenWithProps = React.Children.map(
            this.props.children,
            (child) => React.cloneElement(child, {
                ...this.state,
                onDraw: this.onDraw,
            })
        );

        return (
            <div>
                <Menu onReset={ this.onReset }/>
                    <div className="flex-container">
                        { childrenWithProps }
                    </div>

            </div>
        );
    },
});

