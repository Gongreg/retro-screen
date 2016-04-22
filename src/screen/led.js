import React, { PropTypes } from 'react';

export default React.createClass({
    displayName: 'Led',

    propTypes: {
        onMouseOver: PropTypes.func,
        onMouseDown: PropTypes.func,
        x: PropTypes.number,
        y: PropTypes.number,
        color: PropTypes.string,
    },

    onMouseDown(e) {
        const { x, y } = this.props;

        this.props.onMouseDown && this.props.onMouseDown({x, y}, e);
    },

    onMouseOver(e) {
        const { x, y } = this.props;

        this.props.onMouseOver && this.props.onMouseOver({x, y}, e);
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

