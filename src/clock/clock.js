import React, { PropTypes } from 'react';
import R from 'ramda';
import moment from 'moment';
import { SketchPicker } from 'react-color';
import Screen from 'screen/screen';
import parseColor from 'parse-color/parse-color';

export default React.createClass({
    displayName: 'Draw',

    propTypes: {
        screenData: PropTypes.object,
        loading: PropTypes.bool,
        onOpenClock: PropTypes.func,
    },

    getInitialState() {
        return {
            color: R.mapObjIndexed(x => parseColor(x), this.props.screenData.clockColors),
        };
    },

    componentWillReceiveProps(newProps) {
        this.setState({
            color: R.mapObjIndexed(x => parseColor(x), newProps.screenData.clockColors),
        });
    },

    onChangeColorNumbers(color) {

        const hexColor = color.hex.substring(1, color.hex.length);

        console.log(color);

        this.setState({
            color: {
                ...this.state.color,
                0: '#' + hexColor,
            }
        });

        this.props.onChangeClockColor({ number: 0, color: hexColor });
    },

    onChangeColor1(color) {

        const hexColor = color.hex.substring(1, color.hex.length);

        this.setState({
            color: {
                ...this.state.color,
                1: '#' + hexColor,
            }
        });

        this.props.onChangeClockColor({ number: 1, color: hexColor });
    },

    onChangeColor2(color) {

        const hexColor = color.hex.substring(1, color.hex.length);

        this.setState({
            color: {
                ...this.state.color,
                2: '#' + hexColor,
            }
        });

        this.props.onChangeClockColor({ number: 2, color: hexColor });
    },

    render() {

        if (this.props.loading) {
            return <div>Loading</div>;
        }

        return (
            <div>
                <h1>Clock</h1>

                <div>
                    Numbers color:
                    <SketchPicker
                        color={this.state.color[0]}
                        onChangeComplete={this.onChangeColorNumbers}
                    />
                </div>
                <div>
                    Color #1:
                    <SketchPicker
                        color={this.state.color[1]}
                        onChangeComplete={this.onChangeColor1}/>
                </div>
                <div>
                    Color #2:
                    <SketchPicker
                        color={this.state.color[2]}
                        onChangeComplete={this.onChangeColor2}
                    />
                </div>

                <button onClick={ this.props.onOpenClock }> Start </button>
            </div>
        );
    },
})
