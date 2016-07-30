const R = require('ramda');

const { sortRows } = require('../utils');

function getPixelDataFromImage(data) {
    return R.splitEvery(4, data).map((data) => {

        let rgb = data[0];
        rgb = (rgb << 8) + data[1];
        rgb = (rgb << 8) + data[2];

        return rgb;
    });
}

function imagePixelsToPixelData(pixels, resolution) {

    return R.pipe(
        R.splitEvery(resolution.x),
        sortRows,
        R.flatten
    )(pixels);
}

module.exports = {
    getPixelDataFromImage,
    imagePixelsToPixelData,
};