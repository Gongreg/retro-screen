const moment = require('moment');

const numbers = require('./data');

const { createEmptyMulti, multiToSingle } = require('../utils');

function drawSeconds(data, seconds, resolution, color) {

    if (seconds === 0) {
        console.log('do nothing!');
        return data;
    }

    let pixelData = data;

    //find maximum radius for clock in screen.
    const center = Math.floor(resolution.x / 2);

    for (let radius = 1; radius <= center; radius++) {

        const perimeter = 4 * (radius * 2 - 1) || 1;

        const pixelsToColor = Math.round((perimeter / 60) * seconds) || 1;

        for (var i = 1; i <= pixelsToColor; i++) {

            if (radius === 1) {
                if (i === 1) {
                    pixelData[center - 1][center] = color;
                } else if (i === 2) {
                    pixelData[center][center] = color;
                } else if (i === 3) {
                    pixelData[center][center - 1] = color;
                } else {
                    pixelData[center - 1][center - 1] = color;
                }

                continue;
            }

            const topRightCorner = radius;
            const bottomRightCorner = 3 * radius - 1; // 3 radiuses to right - 1 corner
            const bottomLeftCorner = 5 * radius - 2; // 5 radiuses to right - 2 corners
            const topLeftCorner = 7 * radius - 3; // 7 radiuses to right - 3 corners

            if (i <= topRightCorner) {
                pixelData[center - radius][center + i - 1] = color;
            }

            if (i > topRightCorner && i <= bottomRightCorner) {

                const rightSide = i - topRightCorner;

                pixelData[center - radius + rightSide][center + radius - 1] = color;
            }

            if (i > bottomRightCorner && i <= bottomLeftCorner) {
                const bottomSide = i - bottomRightCorner;

                pixelData[center + radius - 1][center + radius - bottomSide - 1] = color;
            }

            if (i > bottomLeftCorner && i <= topLeftCorner) {
                const leftSide = i - bottomLeftCorner;

                pixelData[center + radius - 1 - leftSide][center - radius] = color;
            }

            if (i > topLeftCorner) {
                const topSide = i - topLeftCorner;

                pixelData[center - radius][center - radius + topSide] = color;
            }
        }

    }

    return pixelData;

}

function drawNumber(data, color, number, topLeftX, topLeftY) {
    let pixelData = data;

    const segments = numbers[number];

    //height
    for (let i = 0; i < 5; i++) {
        //width
        for (let j = 0; j < 3; j++) {
            //if this pixel is taken in number, color it, otherwise leave the same color.
            if (segments[i * 3 + j]) {
                pixelData[topLeftX + i][topLeftY + j] = color;
            }
        }
    }

    return pixelData;
}

let i = 0;
let j = 0;
function getClockState(screenData) {

    const date = moment().add(1, 'second');

    const seconds = +date.format('s');
    const hours = +date.format('HH');
    const minutes = +date.format('mm');

    const primaryIndex = minutes % 2;
    const secondaryIndex = +!primaryIndex;

    const primaryColor = screenData.clockColors[primaryIndex];
    const secondaryColor = screenData.clockColors[secondaryIndex];

    const numbersColor = screenData.clockColors[2];

    let pixelData = createEmptyMulti(screenData.resolution, secondaryColor);

    pixelData = drawSeconds(pixelData, seconds, screenData.resolution, primaryColor);
    pixelData = drawNumber(pixelData, numbersColor, Math.floor(hours / 10), 2, 4);
    pixelData = drawNumber(pixelData, numbersColor, hours % 10, 2, 9);
    pixelData = drawNumber(pixelData, numbersColor, Math.floor(minutes / 10), 9, 4);
    pixelData = drawNumber(pixelData, numbersColor, minutes % 10, 9, 9);

    pixelData = multiToSingle(pixelData);

    return pixelData;

}

module.exports = {
    drawSeconds,
    drawNumber,
    getClockState,
};