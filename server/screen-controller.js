const ws281x = require('rpi-ws281x-native');

const { serialize, clearTimeouts: clearTimeoutsHelper } = require('./utils');

//example of state
//state: {
//    screenData: {
//        leds: 256,
//        resolution: {
//            x: 16,
//            y: 16,
//        },
//        pixelData: new Uint32Array(256),
//        brightness: 100,
//        maxBrightness: 255,
//        clockColors: [0x4A90E2, 0xD0021B, 0xF8E71C],
//    },
//    rerender: false,
//    fps: 60,
//    timeout: 0,
//    renderTimeout: null,
//    nextRender: 0,
//    timeouts: {},
//},

const screenController = {};

function init({ leds, resolution, maxBrightness, defaultBrightness, fps }) {

  const timeout = 1000 / fps;

  const initialState = {
    screenData: {
      leds,
      resolution,
      pixelData: new Uint32Array(leds),
      brightness: defaultBrightness,
      maxBrightness,
      clockColors: [0x4A90E2, 0xD0021B, 0xF8E71C],
    },
    rerender: true,
    fps,
    timeout,
    nextRender: +new Date,
    renderTimeout: null,
    timeouts: {},
  };

  screenController.initialState = Object.assign({}, initialState);
  screenController.state = initialState;

  ws281x.init(screenController.state.screenData.leds);

  render();
}

function setState(state, rerender = true) {
  screenController.state = Object.assign(
    {},
    screenController.state,
    state,
    { rerender }
  );
}

function setScreenState(screenData, rerender = true) {

  screenController.state.screenData = Object.assign(
    {},
    screenController.state.screenData,
    screenData
  );

  screenController.state.rerender = rerender;
}

function render() {
  if (screenController.state.rerender) {
    screenController.state.rerender = false;

    ws281x.setBrightness(screenController.state.screenData.brightness);
    ws281x.render(screenController.state.screenData.pixelData);
  }

  const now = +new Date;
  const late = now > screenController.state.nextRender ? now - screenController.state.nextRender : 0;
  const nextRender = screenController.state.timeout - late;

  screenController.state.nextRender = now + nextRender;
  screenController.state.renderTimeout = setTimeout(render, nextRender);
}

function exit() {
  ws281x.reset();
  clearTimeouts();
}

function getScreenData() {
  return screenController.state.screenData;
}

function getSerializedScreenData() {
  return serialize(screenController.state.screenData);
}

function clearTimeouts() {
  clearTimeoutsHelper(screenController.state.timeouts);
}

function reset() {
  clearTimeouts(screenController.state.timeouts);
  clearTimeout(screenController.state.renderTimeout);

  screenController.setState({
    screenData: Object.assign(
      {}, screenController.initialState.screenData, { pixelData: new Uint32Array(screenController.initialState.screenData.leds) }
    ),
    timeouts: {},
  });
}

function addTimeout(name, timeout) {
  screenController.state.timeouts[name] = timeout;
}

module.exports = {
  init,
  render,
  reset,
  exit,
  getSerializedScreenData,
  getScreenData,
  clearTimeouts,
  setState,
  setScreenState,
  setTimeout: addTimeout,
};
