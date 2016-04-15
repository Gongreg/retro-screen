import React, { PropTypes } from 'react';
import R from 'ramda';

import Led from './led';
import parseColor from 'parse-color/parse-color';

function rowReverse(rowIndex) {
    return rowIndex % 2 == 0;
}

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

        if (loading) {
            return (
                <div className="container">
                    <div className="screen-container">
                        <div>Loading</div>
                    </div>
                </div>
            );
        }

        const rows = R.splitEvery(x, pixelData);


        const sortedRows = rows.map((ledRow, rowIndex) => rowReverse(rowIndex) ? R.reverse(ledRow) : ledRow);

        return (
            <div className="container">
                <div className="screen-container">
                    { loading &&
                    <div>Loading</div>
                    }
                    { !loading && pixelData.length !== 0 &&

                    <div className="screen">
                        {sortedRows.map((ledRow, rowIndex) => {
                            return (
                                <div key={ 'x-' + rowIndex } className="ledRow">
                                    {ledRow.map((led, ledIndex) => {

                                        const indexInRow = rowReverse(rowIndex) ? (x - 1) - ledIndex : ledIndex;

                                        return (
                                            <Led
                                            {...props}
                                            key={ 'x-' + rowIndex + 'y-' + ledIndex }
                                            index={ x * rowIndex + indexInRow }
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
            </div>
        );
    },
});

