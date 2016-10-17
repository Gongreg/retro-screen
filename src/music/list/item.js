import React, { PropTypes } from 'react';

export default React.createClass({
    displayName: 'MusicListItem',

    onClick() {

        const { id, kind, column } = this.props;

        this.props.onSelectResult({
            id,
            column,
            kind,
        });
    },

    render() {
        return (
            <li onClick={ this.onClick }>{ this.props.kind } { this.props.title } </li>
        );
    },
});
