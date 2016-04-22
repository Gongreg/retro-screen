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

        const { screenData: { pixelData }, loading, ...props } = this.props;

        if (loading) {
            return (
                <div className="container">
                    <div className="screen-container">
                        <div>Loading</div>
                    </div>
                </div>
            );
        }
        return (
            <div className="screen-container">
                { loading &&
                <div>Loading</div>
                }
                { !loading && pixelData.length !== 0 &&

                <div className="screen">
                    {pixelData.map((ledRow, rowIndex) => {
                        return (
                            <div key={ 'x-' + rowIndex } className="ledRow">
                                {ledRow.map((led, ledIndex) => {

                                    return (
                                        <Led
                                        {...props}
                                        key={ 'x-' + rowIndex + 'y-' + ledIndex }
                                        y={ rowIndex }
                                        x={ ledIndex }
                                        color={ parseColor(led) }
                                        />
                                    );

                                })}
                            </div>
                        );
                    }) }
                </div>
                }
            </div>
        );
    },
});

