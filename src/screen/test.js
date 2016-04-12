import React, { PropTypes } from 'react';

import Screen from './screen';

export default React.createClass({
    displayName: 'ScreenTest',

    render() {

        return (
            <div>
                <h1>Screen</h1>
                <Screen {...this.props} />
            </div>
        );
    },
});

