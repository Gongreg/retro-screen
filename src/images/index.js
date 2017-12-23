import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import sanitizeFilename from 'sanitize-filename';
import {connect} from 'react-redux';

import * as actions from '../state/actions';


class Images extends PureComponent {
  static displayName = 'Images';

  static propTypes = {
    onUploadImage: PropTypes.func,
    screenData: PropTypes.object,
    loading: PropTypes.bool,
  };

  state = {
    file: null,
    name: 'super-awesome-image',
  };

  onDrop = (files) => {

    const file = files[0];

    const name = sanitizeFilename(file.name.substring(0, file.name.lastIndexOf('.') || file.name.length));

    this.setState({
      file,
      name
    });

  };

  onClickUpload = () => {

    const {file, name} = this.state;

    if (!file) {
      return;
    }

    this.props.dispatch(actions.onUploadImage({file, name}));
  };

  onClickCancel = () => {
    this.setState({
      file: null,
    });
  };

  onChange = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  render() {

    if (this.props.loading) {
      return (
        <div>
          <h1>Images</h1>
          Loading
        </div>
      );
    }

    return (
      <div>
        <h1>Images</h1>
        {!this.state.file &&
        <Dropzone
          style={{
            width: '500px',
            height: '100px',
            border: '2px dashed #666',
          }}
          accept={"image/*"}
          onDrop={this.onDrop}
          multiple={false}
        >
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
        }

        {this.state.file &&
        <div>
          <img src={this.state.file.preview} height="64"/>
          <label>Display name: <input onChange={this.onChange} value={this.state.name}/></label>
          <button onClick={this.onClickUpload}>Upload</button>
          <button onClick={this.onClickCancel}>Cancel</button>
        </div>
        }
      </div>
    );
  }
}

export default connect(state => state)(Images);
