import React, { PropTypes } from 'react';

import MusicListGroup from './list/group';

export default React.createClass({
    displayName: 'TrackList',

    getInitialState() {
        return {
            searchValue: '',
        };
    },

    onChangeSearch({ target: { value } }) {
        this.setState({
            searchValue: value,
        });
    },

    onSubmitSearch(e) {
        e.preventDefault();

        this.props.socket.emit('searchMusicYoutube', this.state.searchValue);
    },

    onSelectResult(result) {
        this.props.socket.emit('selectResult', result);
    },

    render() {
        return (
            <div>
                <form onSubmit={ this.onSubmitSearch }>
                    <label>
                        Search
                        <input type="text" onChange={ this.onChangeSearch } value={ this.state.searchValue } />
                    </label>
                    <input type="submit"/>
                </form>
                { this.props.musicSearchResults.map((group, index) => {
                    return <MusicListGroup onSelectResult={ this.onSelectResult } key={ index } column={ index } group={ group }/>
                })}
            </div>
        );
    },
});

;
