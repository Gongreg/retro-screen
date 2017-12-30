import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import * as actions from '../state/actions';
import ColorSelect from '../color-select';

class Text extends PureComponent {
  static displayName = 'Text';

  static propTypes = {
    screenData: PropTypes.object,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      text: null,
      textSpeed: null,
    };
  }

  onChangeColor = (number, color) => {
    this.props.dispatch(actions.onChangeTextColor({number, color}));
  };

  onChangeText = (e) => {
    this.setState({text: e.target.value});
  };

  onOpenClock = () => {
    this.props.dispatch(actions.onChangeTextSpeed(this.state.textSpeed));
    this.props.dispatch(actions.onStartText(this.state.text));
  };

  onChangeTextSpeed = (e) => {
    this.setState({textSpeed: e.target.value});
  };

  render() {

    const {screenData: {textColors, textSpeed, text}, loading} = this.props;

    if (loading) {
      return <div>Loading</div>;
    }

    return (
      <div className="clock">
        <h1>Scrolling text</h1>

        <div>
          <textarea value={this.state.text === null ? text : this.state.text} onChange={this.onChangeText}/>
          <div style={{padding: '15px 0'}}>
            Speed (in ms)
            <input
              type="number"
              min="0"
              value={this.state.textSpeed === null ? textSpeed : this.state.textSpeed}
              onChange={this.onChangeTextSpeed}
            />
          </div>
        </div>
        <div className="color-container">
          <ColorSelect
            color={textColors[0]}
            index={0}
            text="Text"
            onChangeComplete={this.onChangeColor}
          />

          <ColorSelect
            color={textColors[1]}
            index={1}
            text="Background"
            onChangeComplete={this.onChangeColor}
          />
        </div>

        <button onClick={this.onOpenClock}>Start</button>
      </div>
    );
  }
}

export default connect(state => state)(Text);
