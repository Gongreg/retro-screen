import React, { PropTypes } from 'react';

export default React.createClass({
    displayName: 'MusicPlayer',

    onClickStart() {
        this.props.socket.emit('musicStart');
    },

    onClickStop() {
        this.props.socket.emit('musicStop');
    },

    onClickResume() {
        this.props.socket.emit('musicResume');
    },

    onClickPause() {
        this.props.socket.emit('musicPause');
    },

    onClickPrev() {
        this.props.socket.emit('musicPrev');
    },

    onClickNext() {
        this.props.socket.emit('musicNext');
    },

    render() {

        return (
            <div>
                <button onClick={ this.onClickStart }> Play </button>
                <button onClick={ this.onClickStop }> Stop </button>

                <button onClick={ this.onClickResume }> Resume </button>
                <button onClick={ this.onClickPause }> Pause </button>
                <button onClick={ this.onClickPrev }> Prev </button>
                <button onClick={ this.onClickNext }> Next </button>
            </div>
        );
    },
});

