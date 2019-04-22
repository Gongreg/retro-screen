import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Controlled as CodeMirror} from 'react-codemirror2';

import * as actions from '../state/actions';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/javascript/javascript');

class Scripts extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      code:
`
/**\

(function tick({pixels, counter, resolution}) {

	return pixels;
})
`,
      name: '',
    };

  }

  onChangeCode = (editor, data, value) => {
    this.setState({code: value});
  };

  onChangeName = (e) => {
    this.setState({name: e.target.value});
  };

  onTestCode = () => {
    this.props.dispatch(actions.onTestCode(this.state.code));
  };

  onSaveCode = () => {
    this.props.dispatch(actions.onSaveCode({code: this.state.code, name: this.state.name}));
  };

  render() {

    const {loading} = this.props;
    if (loading) {
      return <div>Loading</div>;
    }

    return (
      <div style={{width: '80%'}}>
        <h1>Script runner</h1>
        <div>
          <CodeMirror
            value={this.state.code}
            options={{
              mode: 'javascript',
              theme: 'material',
              lineNumbers: true
            }}
            onBeforeChange={this.onChangeCode}
            onChange={this.onChangeCode}
          />
          <label style={{marginTop: '15px'}}>Script Name: <input value={this.state.name} onChange={this.onChangeText}/></label>
        </div>
        <button onClick={this.onTestCode}>Test</button>
        <button onClick={this.onSaveCode}>Save</button>

        {this.props.scriptError &&
        <code>
          {this.props.scriptError}
        </code>
        }
      </div>
    );
  }
}

export default connect(state => ({loading: state.loading, scriptError: state.scriptError}))(Scripts);
