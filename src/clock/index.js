import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import * as actions from '../state/actions';
import ColorSelect from './color-select';

class Clock extends PureComponent {
  static displayName = 'Clock';

  static propTypes = {
    screenData: PropTypes.object,
    loading: PropTypes.bool,
  };

  onChangeColor = (number, color) => {
    this.props.dispatch(actions.onChangeClockColor({number, color}));
  };

  onOpenClock = () => {
    this.props.dispatch(actions.onOpenClock());
  };

  render() {

    const {screenData: {clockColors}, loading} = this.props;

    if (loading) {
      return <div>Loading</div>;
    }

    return (
      <div className="clock">
        <h1>Clock</h1>

        <div className="color-container">
          <ColorSelect
            color={clockColors[0]}
            index={0}
            text="Color #1:"
            onChangeComplete={this.onChangeColor}
          />

          <ColorSelect
            color={clockColors[1]}
            index={1}
            text="Color #2:"
            onChangeComplete={this.onChangeColor}
          />

          <ColorSelect
            color={clockColors[2]}
            index={2}
            text="Numbers color:"
            onChangeComplete={this.onChangeColor}
          />
        </div>

        <button onClick={this.onOpenClock}>Start</button>
      </div>
    );
  }
}

export default connect(state => state)(Clock);
