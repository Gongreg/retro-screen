import React, { PropTypes } from 'react';
import R from 'ramda';

//import ColorPicker from 'react-color-picker';

import Screen from 'screen/screen';

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
        };
    },

    onMouseOverLed(index, e) {

        e.preventDefault();
        if (e.nativeEvent.buttons !== 1) {
            return;
        }

        const color = parseInt(this.state.color, 16);

        const { screenData: { pixelData } } = this.props;

        if (pixelData[index] === color) {
            return;
        }

        this.props.onDraw({index, color});

    },

    onMouseDownLed(index) {

        const color = parseInt(this.state.color, 16);

        const { screenData: { pixelData } } = this.props;

        if (pixelData[index] === color) {
            return;
        }

        this.props.onDraw({index, color});
    },

    onDragColor(color) {

        this.setState({
            color: color.substring(1),
        });
    },

    onChange(event) {
        this.setState({
            color: event.target.value,
        });
    },

    render() {
        return (
            <div>
                <h1>Draw</h1>
            {/*<ColorPicker value={this.state.color} onChange={this.onDragColor} onDrag={this.onDragColor} saturationWidth={150} saturationHeight={150} hueWidth={20} />*/}

                <input onChange={this.onChange} value={this.state.color} />

               <Screen {...this.props} onMouseDown={this.onMouseDownLed} onMouseOver={this.onMouseOverLed} />

            </div>
        );
    },
})
