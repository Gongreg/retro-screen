const {VM, VMScript} = require('vm2');
const {createEmptyMulti, multiToSingle} = require('../utils');

const screenController = require('../screen-controller');

const resolution = screenController.getScreenData().resolution;

const vm = new VM({
  timeout: screenController.getFps().fps,
  sandbox: {
    createEmptyMulti
  },
});

module.exports = function (io, socket) {

  socket.on('testCode', function (code) {
    const script = new VMScript(code);
    let counter = 0;
    function render() {
      let pixelData;

      const props = {
        pixels: screenController.getSerializedScreenData().pixelData,
        counter,
        resolution,
      };

      try {
        const result = vm.run(script)(props);
        pixelData = multiToSingle(result);
        if (pixelData.length !== resolution.x * resolution.y) {
          throw new Error('Wrong result');
        }
      } catch (err) {
        console.error('Failed to run script.', err);
        screenController.clearTimeouts();
        socket.emit('scriptError', err.message);
        return;
      }

      screenController.setScreenState({pixelData});

      io.emit('newState', screenController.getSerializedScreenData());

      screenController.setTimeout('scriptRender', setTimeout(render, screenController.getFps().timeout));

      counter++;
    }

    screenController.reset({resetBrightness: false});
    render();

  });
};
