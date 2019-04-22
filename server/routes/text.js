const screenController = require('../screen-controller');

const {getTextState, shouldReset} = require('../text/utils');

module.exports = function (io, socket) {

  socket.on('text', function (text) {

    screenController.setScreenState({text: text || ''});

    let pixelData = null;
    let currentLetterCycle = 0;

    function updateState() {
      if (shouldReset(screenController.getScreenData(), currentLetterCycle)) {
        currentLetterCycle = 0;
      }
      pixelData = getTextState(screenController.getScreenData(), currentLetterCycle);
      currentLetterCycle++;
    }

    function render() {
      updateState();
      screenController.setScreenState({pixelData, currentLetterCycle});

      screenController.setTimeout('textRender', setTimeout(render, screenController.getScreenData().textSpeed));

    }

    screenController.clearTimeouts();
    render();

  });

  socket.on('textColor', function (data) {

    const number = parseInt(data.number, 10);

    if (isNaN(number)) {
      return;
    }

    const colorString = typeof data.color === 'string' ? data.color.substr(1) : '';

    const color = parseInt(colorString, 16);

    if (isNaN(color)) {
      return;
    }

    const textColors = screenController.getScreenData().textColors;

    textColors[number] = color;

    screenController.setScreenState({textColors});

  });

  socket.on('textSpeed', function (data) {

    const textSpeed = parseInt(data, 10);

    if (isNaN(textSpeed) || textSpeed < 0) {
      return;
    }

    screenController.setScreenState({textSpeed});
  });
};
