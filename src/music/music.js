import React, { PropTypes } from 'react';

import TrackList from './track-list';
import MusicPlayer from './music-player';

export default React.createClass({
    displayName: 'Music',

    render() {

        return (
            <div>

                <h1>Music</h1>

                <TrackList { ...this.props } />

                <MusicPlayer { ...this.props } />

            </div>
        );
    },
});

