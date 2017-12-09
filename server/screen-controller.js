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

const sctrl = {};

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

  sctrl.initialState = Object.assign({}, initialState);
  sctrl.state = initialState;

  ws281x.init(sctrl.state.screenData.leds, {dmaNum: 9});

  render();
}

function setState(state, rerender = true) {
  sctrl.state = Object.assign(
    {},
    sctrl.state,
    state,
    { rerender }
  );
}

function setScreenState(screenData, rerender = true) {

  sctrl.state.screenData = Object.assign(
    {},
    sctrl.state.screenData,
    screenData
  );

  sctrl.state.rerender = rerender;
}

function render() {
  if (sctrl.state.rerender) {
    sctrl.state.rerender = false;

    ws281x.setBrightness(sctrl.state.screenData.brightness);
    ws281x.render(sctrl.state.screenData.pixelData);
  }

  const now = +new Date;
  const late = now > sctrl.state.nextRender ? now - sctrl.state.nextRender : 0;
  const nextRender = sctrl.state.timeout - late;

  sctrl.state.nextRender = now + nextRender;
  sctrl.state.renderTimeout = setTimeout(render, nextRender);
}

function exit() {
  clearTimeout(sctrl.state.renderTimeout);
  clearTimeouts();
  ws281x.reset();
}

function getScreenData() {
  return sctrl.state.screenData;
}

function getSerializedScreenData() {
  return serialize(sctrl.state.screenData);
}

function clearTimeouts() {
  clearTimeoutsHelper(sctrl.state.timeouts);
}

function reset() {
  clearTimeouts(sctrl.state.timeouts);

  setState({
    screenData: Object.assign(
      {}, sctrl.initialState.screenData, { pixelData: new Uint32Array(sctrl.initialState.screenData.leds) }
    ),
    timeouts: {},
  });
}

function addTimeout(name, timeout) {
  sctrl.state.timeouts[name] = timeout;
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
