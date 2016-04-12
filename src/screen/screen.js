import React from 'react';
import R from 'ramda';

function parseColor(color) {
    if (typeof color === 'number') {
        //make sure our hexadecimal number is padded out
        color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
    }

    return color;
}

function parseScreenData(screenData) {
    return {
        screenData: {
            ...screenData,
            pixelData: R.values(screenData.pixelData),
        },
    };
}

export default React.createClass({

    displayName: 'Screen',

    getInitialState() {
        return {
            screenData: {
                pixelData: [],
                resolution: {
                    x: 0,
                    y: 0,
                }
            },
            loading: true,
        };
    },

    componentWillMount() {
        const socket = io();
        socket.on('init', this.onInit);
        socket.on('reset', this.onGetData);
        socket.on('brightness', this.onGetData);
    },

    onInit(screenData) {
        this.setState({
            loading: false,
            ...parseScreenData(screenData),
        });

    },

    onGetData(screenData) {
        this.setState(parseScreenData(screenData));
    },

    render() {
        const { screenData: { pixelData, resolution: { x, y } }, loading } = this.state;

        return (
            <div className="container">
                <h1>Screen</h1>
                <div className="screen-container">
                    { loading &&
                    <div>Loading</div>
                    }
                    { !loading && pixelData.length !== 0 &&

                    <div className="screen">
                        { R.splitEvery(x, pixelData).map((ledsRow, rowIndex) => {
                            return (
                                <div key={ 'x-' + rowIndex } className="ledRow">
                                    {ledsRow.map((led, ledIndex) =>
                                        <div
                                            key={ 'x-' + rowIndex + 'y-' + ledIndex }
                                            className="led"
                                            style={{backgroundColor: parseColor(led)}}
                                        />
                                    )}
                                </div>
                            );
                        }) }
                    </div>
                    }
                </div>
            </div>
        );
    },
});

