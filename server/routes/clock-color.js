const screenController = require('../screen-controller');

module.exports = function (io, socket) {
    socket.on('clockColor', function(data) {
        const number = data.number || 0;

        const parsed = parseInt(data.color, 16);

        const color = !isNaN(parsed) ? parsed : 0xffffff;

        const clockColors = screenController.getScreenData().clockColors;
        clockColors[number] = color;

        screenController.setScreenState({ clockColors });

    });
};