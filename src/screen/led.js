import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class Led extends PureComponent {
  static displayName = 'Led';

  static propTypes = {
    onMouseOver: PropTypes.func,
    onMouseDown: PropTypes.func,
    x: PropTypes.number,
    y: PropTypes.number,
    color: PropTypes.string,
  };

  onMouseDown = (e) => {
    const {x, y} = this.props;

    this.props.onMouseDown && this.props.onMouseDown({x, y}, e);
  };

  onMouseOver = (e) => {
    const {x, y} = this.props;

    this.props.onMouseOver && this.props.onMouseOver({x, y}, e);
  };

  render() {
    return (
      <div
        className="led"
        style={{backgroundColor: this.props.color}}
        onMouseDown={this.onMouseDown}
        onMouseOver={this.onMouseOver}
      />
    );
  }
}

