const screenController = require('../screen-controller');

module.exports = function (io, socket) {

    socket.on('shutdown', function () {

        // the native module might even be harmful (or won't work in the best case)
        // in the wrong environment, so we make sure that at least everything we can
        // test for matches the raspberry-pi before loading the native-module
        if (process.arch !== 'arm' && process.platform !== 'linux') {
            console.log('You don\'t want to turn off your pc, do you?');

            return;
        }

        screenController.exit();

        io.emit('exit');

        const exec = require('child_process').exec;
        exec('sudo halt', (error, stdout, stderr) => {
            console.log(error, stdout, stderr);
        });

    });
};