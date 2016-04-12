"use strict";

function rpiWrapper() {
    if (process.arch !== 'arm' && process.platform !== 'linux') {
        console.log('Project running on test environment');
        return require('./rpi-ws281x-test');
    } else {
        const native = require('rpi-ws281x-native');

        return Object.assign(
            native,
            {
                render(screenData) {
                    native.render(screenData.pixelData);
                },
                setBrightness(screenData) {
                    native.setBrightness(screenData.brightness);
                }
            }
        );
    }
}

module.exports = rpiWrapper();

