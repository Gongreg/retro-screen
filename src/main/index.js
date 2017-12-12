import React, {PureComponent} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import ioClient from '../io';

class Main extends PureComponent {
  static displayName = 'Main';

  componentWillMount() {
    ioClient.initClient(this.props.dispatch);
  }

  onChangeVisualizerEnabled = () => {
    const screenData = {
      ...this.state.screenData,
      visualizerEnabled: !this.state.screenData.visualizerEnabled,
    };

    this.socket.emit('visualizerEnabled');

    this.setState({
      screenData,
    });
  };

  render() {
    return this.props.children;
  }
}

export default withRouter(connect()(Main));
