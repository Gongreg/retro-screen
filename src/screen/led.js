import React, { PropTypes } from 'react';

export default React.createClass({
    displayName: 'Led',

    propTypes: {
        onMouseOver: PropTypes.func,
        onMouseDown: PropTypes.func,
        index: PropTypes.number,
        color: PropTypes.string,
    },

    onMouseDown(e) {
        this.props.onMouseDown && this.props.onMouseDown(this.props.index, e);
    },

    onMouseOver(e) {
        this.props.onMouseOver && this.props.onMouseOver(this.props.index, e);
    },

    render() {
        return (
            <div
                className="led"
                style={{backgroundColor: this.props.color}}
                {...this.props}
                onMouseDown={ this.onMouseDown }
                onMouseOver={ this.onMouseOver }
            />
        );
    },
});

