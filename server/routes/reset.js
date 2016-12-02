const screenController = require('../screen-controller');

module.exports = function (io, socket) {

    socket.on('reset', function () {

        screenController.reset();

        io.emit('afterReset', screenController.getSerializedScreenData());

    });
};
