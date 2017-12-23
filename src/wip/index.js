import React, {PureComponent} from 'react';

import {Alert} from 'react-bootstrap';

export default class WIP extends PureComponent {
  static displayName = 'WIP';

  render() {
    return (
      <Alert bsStyle="warning">
        <strong>Oh snap!</strong> Work in progress.
      </Alert>
    );
  }
}

