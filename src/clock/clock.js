import React, { PropTypes } from 'react';
import R from 'ramda';
import moment from 'moment';

import Screen from 'screen/screen';

export default React.createClass({
    displayName: 'Draw',

    propTypes: {
        screenData: PropTypes.object,
        loading: PropTypes.bool,
        onOpenClock: PropTypes.func,
    },

    getInitialState() {
        return {
        };
    },

    componentWillMount() {
        this.props.onOpenClock();
    },

    render() {
        return (
            <div>
                <h1>Clock</h1>

                <Screen {...this.props} />

            </div>
        );
    },
})
