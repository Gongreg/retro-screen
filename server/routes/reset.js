const screenController = require('../screen-controller');

module.exports = function (io, socket) {

    socket.on('reset', function (brightness) {
        screenController.reset();

        io.emit('afterReset', screenController.getScreenData());

    });
};