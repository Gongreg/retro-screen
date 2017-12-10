const screenController = require('../screen-controller');

module.exports = function (io, socket) {

    socket.on('visualizerEnabled', function () {

        const visualizerEnabled = !screenController.getScreenData().visualizerEnabled;

        screenController.setScreenState({visualizerEnabled});

        socket.broadcast.emit('afterVisualizerEnabled', visualizerEnabled);
    });

};
