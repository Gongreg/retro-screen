import React, {PureComponent} from 'react';
import {SketchPicker} from 'react-color';

export default class ColorSelect extends PureComponent {
  static displayName = 'ClockColorSelect';

  onChangeComplete = (color) => {
    this.props.onChangeComplete(this.props.index, color.hex);
  };

  render() {

    const {text, color} = this.props;

    const className = 'clock-color-select';

    return (
      <div className={className}>
        {text}
        <SketchPicker
          color={color}
          onChangeComplete={this.onChangeComplete}/>
      </div>
    );
  }
}
