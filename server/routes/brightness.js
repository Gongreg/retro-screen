const screenController = require('../screen-controller');

module.exports = function (io, socket) {

    socket.on('brightness', function (brightness) {
        const newBrightness = parseInt(brightness);

        if (newBrightness >= 0 && newBrightness <= screenController.getScreenData().maxBrightness) {
            screenController.setState({ brightness });

            io.emit('afterBrightness', brightness);
        }
    });

};