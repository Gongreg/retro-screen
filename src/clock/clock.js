import React, { PropTypes } from 'react';
import R from 'ramda';

import ColorSelect from './color-select';

export default React.createClass({
    displayName: 'Draw',

    propTypes: {
        screenData: PropTypes.object,
        loading: PropTypes.bool,
        onOpenClock: PropTypes.func,
    },

    onChangeColor(number, color) {
        this.props.onChangeClockColor({ number, color });
    },

    render() {

        const { screenData: { clockColors }, loading, onOpenClock } = this.props;

        if (loading) {
            return <div>Loading</div>;
        }

        return (
            <div className="clock">
                <h1>Clock</h1>

                <div className="color-container">
                    <ColorSelect
                        color={ clockColors[0] }
                        index={ 0 }
                        text="Color #1:"
                        onChangeComplete={ this.onChangeColor }
                    />

                    <ColorSelect
                        color={ clockColors[1] }
                        index={ 1 }
                        text="Color #2:"
                        onChangeComplete={ this.onChangeColor }
                    />

                    <ColorSelect
                        color={ clockColors[2] }
                        index={ 2 }
                        text="Numbers color:"
                        onChangeComplete={ this.onChangeColor }
                    />
                </div>

                <button onClick={ onOpenClock }>Start</button>
            </div>
        );
    },
})
