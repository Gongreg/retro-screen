import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import Screen from './index';

class ScreenTest extends PureComponent {
  static displayName = 'ScreenTest';

  render() {

    return (
      <div>
        <h1>Screen</h1>
        <Screen {...this.props} />
      </div>
    );
  }
}

export default connect(state => state)(ScreenTest);
