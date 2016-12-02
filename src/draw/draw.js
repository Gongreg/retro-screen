import React, { PropTypes } from 'react';
import R from 'ramda';
import { CompactPicker, PhotoshopPicker } from 'react-color';
import moment from 'moment';

import Screen from 'screen/screen';

const colors = [
    '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00',
    '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
    '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400',
    '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
    '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00',
    '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E',
];

export default React.createClass({
    displayName: 'Draw',

    propTypes: {
        screenData: PropTypes.object,
        loading: PropTypes.bool,
        onDraw: PropTypes.func,
    },

    getInitialState() {
        return {
            color: 'ffffff',
            display: false,
        };
    },

    onMouseOverLed({y, x}, e) {

        e.preventDefault();
        if (e.nativeEvent.buttons !== 1) {
            return;
        }

        const color = parseInt(this.state.color, 16);

        const { screenData: { pixelData } } = this.props;

        if (pixelData[y][x] === color) {
            return;
        }

        this.props.onDraw({coordinates: { x, y }, color});

    },

    onMouseDownLed({y, x}) {

        const color = parseInt(this.state.color, 16);

        const { screenData: { pixelData } } = this.props;

        if (pixelData[y][x] === color) {
            return;
        }

        this.props.onDraw({coordinates: { x, y }, color});
    },

    onChangeColor( color ) {
        this.setState({
            color: color.hex.substring(1, color.hex.length),
        });
    },

    onClickMoreColor() {
        this.setState({
            display: !this.state.display,
        });
    },

    onClickSave() {

        const {x, y} = this.props.screenData.resolution;

        let canvas = document.createElement('canvas');
        canvas.width = x;
        canvas.height = y;

        let context = canvas.getContext('2d');
        let canvasData = context.getImageData(0, 0, x, y);

        const setColorsForPixels = R.pipe(
            R.splitEvery(4),
            (pixels) => {
                return pixels.map((pixel, index) => {

                    const screenX = index % x;
                    const screenY = (index - screenX) / x;

                    const screenPixel = this.props.screenData.pixelData[screenY][screenX];

                    return [
                        (screenPixel >> 0x10) & 0xff, //r,
                        (screenPixel >> 0x8) & 0xff,//g
                        screenPixel & 0xff, //b
                        255,
                    ];
                });
            },
            R.flatten
        );

        canvasData.data.set(setColorsForPixels(canvasData.data));

        context.putImageData(canvasData, 0, 0);

        const date = moment().format('YYYY-MM-DD-HH-mm-ss');

        const link = document.createElement('a');
        link.setAttribute('download', 'drawing-' + date + '.png');
        link.setAttribute('href', canvas.toDataURL().replace("image/png", "image/octet-stream"));
        link.click();
    },


    render() {
        return (
            <div>
                <h1>Draw</h1>

                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    { !this.state.display &&
                    <CompactPicker
                        color={this.state.color}
                        onChangeComplete={this.onChangeColor}
                        colors={colors}
                    />
                    }
                    { this.state.display &&
                        <PhotoshopPicker
                            color={this.state.color}
                            onChangeComplete={this.onChangeColor}
                        />
                    }

                    <div>
                        <button style={{ marginTop: '10px', marginRight: '30px' }} onClick={ this.onClickMoreColor }>
                            { (this.state.display && 'Less') || 'More' }
                        </button>
                        <button style={{ marginTop: '10px', marginRight: '30px' }} onClick={ this.onClickSave }>
                            Save
                        </button>
                    </div>
                </div>

                <div className="inner-container">

                    <Screen {...this.props} onMouseDown={this.onMouseDownLed} onMouseOver={this.onMouseOverLed} />

                </div>
            </div>
        );
    },
})
