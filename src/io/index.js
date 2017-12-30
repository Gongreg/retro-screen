import * as actions from '../state/actions';

class ioClient {
  initClient(dispatch) {
    this.dispatch = dispatch;

    this.socket = io();
    this.socket.on('init', this.onInit);
    this.socket.on('afterDraw', this.afterDraw);
    this.socket.on('afterBrightness', this.afterBrightness);
    this.socket.on('afterVisualizerEnabled', this.afterVisualizerEnabled);
    this.socket.on('afterReset', this.newState);
    this.socket.on('newState', this.newState);
  }

  onInit = ({screenData}) => {
    this.dispatch(actions.onInit(screenData));
  };

  onDraw = ({coordinates, color}) => {
    this.socket.emit('draw', {coordinates, color});
  };

  afterDraw = ({coordinates, color}) => {
    this.dispatch(actions.afterDraw({coordinates, color}));
  };

  onChangeClockColor = ({number, color}) => {
    this.socket.emit('clockColor', {number, color});
  };

  onChangeTextColor = ({number, color}) => {
    this.socket.emit('textColor', {number, color});
  };

  onStartText = (text) => {
    this.socket.emit('text', text);
  };

  onOpenClock = () => {
    this.socket.emit('clock');
  };

  newState = (screenData) => {
    this.dispatch(actions.onNewState(screenData));
  };

  onUploadImage = ({file, name}) => {
    this.socket.emit('imageUpload', {file, name});
  };

  afterBrightness = (brightness) => {
    this.dispatch(actions.afterBrightness(brightness));
  };

  afterVisualizerEnabled = (visualizerEnabled) => {
    this.dispatch(actions.afterVisualizerEnabled(visualizerEnabled));
  };

  onShutdown = () => {
    this.socket.emit('shutdown');
  };

  onReset = () => {
    this.socket.emit('reset');
  };

  onChangeBrightness = (brightness) => {
    this.socket.emit('brightness', brightness);
  };

  onChangeVisualizerEnabled = () => {
    this.socket.emit('visualizerEnabled');
  };

  onChangeTextSpeed = (textSpeed) => {
    console.log('emit', textSpeed);
    this.socket.emit('textSpeed', textSpeed);
  }
}

export default new ioClient();
