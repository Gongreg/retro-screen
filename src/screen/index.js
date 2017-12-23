import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Led from './led';
import {parseColor} from '../utils';

export default class Screen extends PureComponent {
  static displayName = 'Screen';

  static propTypes = {
    onMouseOver: PropTypes.func,
    onMouseDown: PropTypes.func,
    screenData: PropTypes.object,
    loading: PropTypes.bool,
  };

  render() {

    const {loading} = this.props;

    if (loading) {
      return (
        <div className="container">
          <div className="screen-container">
            <div>Loading</div>
          </div>
        </div>
      );
    }

    const {screenData: {pixelData}, ...props} = this.props;

    return (
      <div className="screen-container">
        {pixelData.length !== 0 &&
        <div className="screen">
          {pixelData.map((ledRow, rowIndex) => {
            return (
              <div key={'x-' + rowIndex} className="ledRow">
                {ledRow.map((led, ledIndex) => {

                  return (
                    <Led
                      {...props}
                      key={'x-' + rowIndex + 'y-' + ledIndex}
                      y={rowIndex}
                      x={ledIndex}
                      color={parseColor(led)}
                    />
                  );

                })}
              </div>
            );
          })}
        </div>
        }
      </div>
    );
  }
}

