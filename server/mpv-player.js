const mpv = require('node-mpv');

const mpvPlayer = new mpv({
    'audio_only': true,
});

module.exports = mpvPlayer;