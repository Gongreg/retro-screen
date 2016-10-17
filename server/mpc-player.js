const exec = require('child_process').exec;

function start() {
    exec('mpc play');
}

function stop() {
    exec('mpc stop');
}

function volume(percent) {
    exec('mpc volume ' + percent);
}

module.exports = {
    start,
    stop,
    volume,
};