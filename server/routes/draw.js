const screenController = require('../screen-controller');

const { calculateIndex } = require('../utils');

module.exports = function (io, socket) {

    socket.on('draw', function (data) {

        if (!data || !data.coordinates || isNaN(data.color)) {
            return;
        }

        const x = data.coordinates.x;
        const y = data.coordinates.y;

        const resolution = screenController.getScreenData().resolution;

        if (x < 0 || x >= resolution.x || y < 0 || y >= resolution.y) {
            return;
        }

        const index = calculateIndex(resolution, data.coordinates);


        if (data.color < 0 || data.color > 0xffffff) {
            return;
        }

        let pixelData = screenController.getScreenData().pixelData;
        pixelData[index] = data.color;

        screenController.clearTimeouts();
        screenController.setScreenState({ pixelData });

        io.emit('afterDraw', data);
    });

};

