const screenController = require('../screen-controller');
//const musicPlayer = require('../music-player');

module.exports = function (io, socket) {

    socket.on('musicStart', function () {

        musicPlayer.loadStream('https://www.youtube.com/user/SensualMusique1');

    });

    socket.on('musicStop', function () {
        musicPlayer.stop();
    });

    socket.on('musicPause', function () {
        musicPlayer.pause();
    });

    socket.on('musicResume', function () {
        musicPlayer.play();
    });

    socket.on('musicNext', function () {
        musicPlayer.next();
    });

    socket.on('musicPrev', function () {
        musicPlayer.prev();
    });
};