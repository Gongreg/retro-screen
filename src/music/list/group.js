import React, { PropTypes } from 'react';

import Item from './item';

export default React.createClass({
    displayName: 'MusicListGroup',

    render() {
        return (
            <div>
                <ul>
                    { this.props.group.map(result => {
                        return (
                            <Item { ...this.props } key={ result.id } { ...result }/>
                        );
                    })}
                </ul>
            </div>
        );
    },
});