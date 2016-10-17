const R = require('ramda');

const youtubeController = require('../youtube-controller');
//const musicPlayer = require('../music-player');

module.exports = function (io, socket) {

    socket.on('searchMusicYoutube', function (value) {

        if (!value) {
            return;
        }

        youtubeController.search(value, 10, (result) => {
            io.emit('afterSearch', result);
        });
    });

    socket.on('searchMusicYoutube', function (value) {

        if (!value) {
            return;
        }

        youtubeController.search(value, 10, (result) => {
            io.emit('afterSearch', result);
        });
    });

    socket.on('selectResult', function (result) {

        console.log('test');
        console.log(result);

        const currentResults = youtubeController.getResults();

        if (!result || !result.id || isNaN(result.column) || !currentResults[result.column]) {
            return;
        }

        const selectedColumn = currentResults[result.column];

        const safeResult = R.find(R.propEq('id', result.id), selectedColumn);

        if (!safeResult) {
            return;
        }

        const baseUrl = 'https://www.youtube.com/';

        let type = '';

        if (safeResult.kind === 'video') {
            type = 'watch?v=';
        } else if (safeResult.kind === 'channel') {
            type = 'channel/';
        } else if (safeResult.kind === 'playlist') {
            type = 'playlist?list=';
        }

        const url = baseUrl + type + safeResult.id;

        console.log(url);

        musicPlayer.loadStream(url);

    });



};