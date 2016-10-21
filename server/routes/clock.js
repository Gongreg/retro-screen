const screenController = require('../screen-controller');

const { getClockState } = require('../clock/utils');

module.exports = function (io, socket) {

    socket.on('clock', function () {

        let pixelData = null;

        function updateState() {
            pixelData = getClockState(screenController.getScreenData());
        }

        function render() {

            screenController.setScreenState({ pixelData });

            io.emit('newState', screenController.getSerializedScreenData());

            screenController.setTimeout('clockRender', setTimeout(render, 1000 - (+ new Date() % 1000)));
            screenController.setTimeout('clockUpdate', setTimeout(updateState, 0));

        }

        screenController.clearTimeouts();
        updateState();
        render();

    });

    socket.on('clockColor', function(data) {

        const number = parseInt(data.number, 10);

        if (isNaN(number)) {
            return;
        }

        const colorString = typeof data.color === 'string' ? data.color.substr(1) : '';

        const color = parseInt(colorString, 16);

        if (isNaN(color)) {
            return;
        }

        const clockColors = screenController.getScreenData().clockColors;

        clockColors[number] = color;

        screenController.setScreenState({ clockColors });

    });

};