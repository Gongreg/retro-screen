import React, { PropTypes } from 'react';
import R from 'ramda';

import Led from './led';
import parseColor from 'parse-color/parse-color';

export default React.createClass({
    displayName: 'Screen',

    propTypes: {
        onMouseOver: PropTypes.func,
        onMouseDown: PropTypes.func,
        screenData: PropTypes.object,
        loading: PropTypes.bool,
    },

    render() {

        const { screenData: { pixelData, resolution: { x } }, loading, ...props } = this.props;

        return (
            <div className="container">
                <div className="screen-container">
                    { loading &&
                    <div>Loading</div>
                    }
                    { !loading && pixelData.length !== 0 &&

                    <div className="screen">
                        { R.splitEvery(x, pixelData).map((ledRow, rowIndex) => {
                            return (
                                <div key={ 'x-' + rowIndex } className="ledRow">
                                    {ledRow.map((led, ledIndex) =>
                                        <Led
                                            {...props}
                                            key={ 'x-' + rowIndex + 'y-' + ledIndex }
                                            index={ x * rowIndex + ledIndex }
                                            color={ parseColor(led) }
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

