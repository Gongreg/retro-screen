import React, { PropTypes } from 'react';

import { SketchPicker } from 'react-color';

export default React.createClass({
    displayName: 'ClockColorSelect',

    onChangeComplete(color) {

        this.props.onChangeComplete(this.props.index, color.hex);
    },

    render() {

        const { text, color, ...props } = this.props;

        const className = 'clock-color-select';

        //const className = classnames(
        //    'clock-color-select',
        //    props.className,
        //)

        return (
            <div className={ className }>
                { text }
                <SketchPicker
                    color={ color }
                    onChangeComplete={ this.onChangeComplete }/>
            </div>
        );
    },
});
