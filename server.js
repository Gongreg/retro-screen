"use strict";

const sanitizeFilename = require('sanitize-filename');
const fs = require('fs');

const R = require('ramda');

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const getPixels = require('get-pixels');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.get('/*', function (req, res) {
    res.render('index.html');
});

const NUM_LEDS = 256;
const DEFAULT_BRIGHTNESS = 100;

let screenData = {
    leds: 256,
    resolution: {
        x: 16,
        y: 16,
    },
    pixelData: new Uint32Array(NUM_LEDS),
    brightness: DEFAULT_BRIGHTNESS,
    maxBrightness: DEFAULT_BRIGHTNESS,
    clockColors: {
        0: 0xffffff,
        1: 0x00ff00,
        2: 0x0000ff,
    },
};

function setScreenData(data) {
    screenData = data;
    clearTimeout(currentCycle);
}

const numbers = [
    [
        1, 1, 1,
        1, 0, 1,
        1, 0, 1,
        1, 0, 1,
        1, 1, 1,
    ],
    [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ],
    [
        1, 1, 1,
        0, 0, 1,
        1, 1, 1,
        1, 0, 0,
        1, 1, 1,
    ],
    [
        1, 1, 1,
        0, 0, 1,
        1, 1, 1,
        0, 0, 1,
        1, 1, 1,
    ],
    [
        1, 0, 1,
        1, 0, 1,
        1, 1, 1,
        0, 0, 1,
        0, 0, 1,
    ],
    [
        1, 1, 1,
        1, 0, 0,
        1, 1, 1,
        0, 0, 1,
        1, 1, 1,
    ],
    [
        1, 1, 1,
        1, 0, 0,
        1, 1, 1,
        1, 0, 1,
        1, 1, 1,
    ],
    [
        1, 1, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ],
    [
        1, 1, 1,
        1, 0, 1,
        1, 1, 1,
        1, 0, 1,
        1, 1, 1,
    ],
    [
        1, 1, 1,
        1, 0, 1,
        1, 1, 1,
        0, 0, 1,
        1, 1, 1,
    ],
];



function rowReverse(rowIndex) {
    return rowIndex % 2 == 0;
}

function serialize(screenData) {

    const x = screenData.resolution.x;

    const rows = R.splitEvery(x, screenData.pixelData);

    const sortedRows = rows.map((ledRow, rowIndex) => rowReverse(rowIndex) ? R.reverse(ledRow) : R.values(ledRow));

    return Object.assign(
        {},
        screenData,
        {
            pixelData: sortedRows
        }
    );

}

function parse(screenData) {

    const sortedRows = screenData.pixelData.map((ledRow, rowIndex) => rowReverse(rowIndex) ? R.reverse(ledRow) : ledRow);

    const rows = R.flatten(sortedRows);

    return Object.assign(
        {},
        screenData,
        {
            pixelData: rows,
        }
    );
}

function createEmptyMulti() {
    return R.range(0, screenData.resolution.y).map(
        x => R.range(0, screenData.resolution.x).map(R.always(0))
    );
}

function createMultiFromData(data) {
    return R.splitEvery(16, data).map((ledRow, rowIndex) => rowReverse(rowIndex) ? R.reverse(ledRow) : ledRow);
}

function multiToSingle(multi) {

    const sortedRows = multi.map((ledRow, rowIndex) => rowReverse(rowIndex) ? R.reverse(ledRow) : ledRow);

    return R.flatten(sortedRows);

}

function calculateIndex(screenData, coordinates) {

    const resolution = screenData.resolution;

    const rowIndex = rowReverse(coordinates.y) ? resolution.x - 1 - coordinates.x : coordinates.x;

    return coordinates.y * resolution.x + rowIndex;
}

function getPixelDataFromImage(data) {
    const fixedData = R.splitEvery(4, data).map((data) => {

        let rgb = data[0];
        rgb = (rgb << 8) + data[1];
        rgb = (rgb << 8) + data[2];

        return rgb;
    });

    const ledsArray = R.splitEvery(screenData.resolution.x, fixedData);

    return parse({ pixelData: ledsArray });

}

function afterImage(pixelData) {
    setScreenData(Object.assign(
        screenData,
        pixelData
    ));

    ws281x.render(screenData.pixelData);

    io.emit('afterImage', serialize(screenData));
}


const ws281x = require('rpi-ws281x-native');

const gm = require('gm').subClass({ imageMagick: true });

ws281x.init(NUM_LEDS);
ws281x.render(screenData.pixelData);
ws281x.setBrightness(screenData.brightness);
ws281x.render(screenData.pixelData);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const moment = require('moment');

let currentCycle = null;

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.emit('init', serialize(screenData));

    //get image list and emit it


    socket.on('brightness', function (brightness) {
        const newBrightness = parseInt(brightness);

        if (newBrightness >= 0 && newBrightness <= 100) {

            setScreenData(Object.assign(
                {},
                screenData,
                { brightness: newBrightness }
            ));

            ws281x.setBrightness(screenData.brightness);
            ws281x.render(screenData.pixelData);

        }

        io.emit('afterBrightness', brightness);
    });

    socket.on('draw', function (data) {

        const x = data.coordinates.x;
        const y = data.coordinates.y;

        if (x < 0 || x >= screenData.resolution.x || y < 0 || y >= screenData.resolution.y) {
            return;
        }

        const index = calculateIndex(screenData, data.coordinates);

        const color = data.color;

        if (color < 0 || color > 0xffffff) {
            return;
        }

        let pixelData = screenData.pixelData;
        pixelData[index] = data.color;

        setScreenData(Object.assign(
            {},
            screenData,
            { pixelData: pixelData }
        ));

        ws281x.render(screenData.pixelData);

        io.emit('afterDraw', data);
    });

    socket.on('imageUpload', function ({file, name = 'super-awesome-image'}) {

        let gmFile = gm(file);

        //Identify gif data
        let extension = '';
        let frameLength = '';

        let error = false;
        gmFile.identify(function (err, data) {

            if (err) {
                console.log('imageUploadIdentifyError' + err);
                error = true;
                return;
            }


            extension = data.format.toLowerCase();

            frameLength =
                data.Delay && data.Delay.map((length) => {

                    const percentOfSecond = length.substring(0, length.lastIndexOf('x'));
                    return parseInt(percentOfSecond, 10) * 10 || 100;
                }) || [];


            gmFile
                .coalesce()
                .scale(screenData.resolution.x, screenData.resolution.y)
                .gravity('Center')
                .background('black')
                .extent(screenData.resolution.x, screenData.resolution.y)
                .toBuffer(extension, (err, buffer) => {

                    if (err) {
                        console.log('gmFileToBufferError', err);
                        error = true;
                        return;
                    }

                    getPixels(buffer, 'image/' + extension, (err, pixels) => {

                        if (err) {
                            console.log('getPixelsError', err);
                            error = true;
                            return;
                        }

                        //gif!
                        if (frameLength.length > 0) {

                            let currentFrame = 0;

                            const parseFrame = function () {

                                const dataLength = pixels.data.length / frameLength.length;

                                const imageData = pixels.data.slice(dataLength * currentFrame, dataLength * (currentFrame + 1));

                                const pixelData = getPixelDataFromImage(imageData);

                                afterImage(pixelData);

                                currentFrame++;
                                if (currentFrame === frameLength.length) {
                                    currentFrame = 0;
                                }

                                currentCycle = setTimeout(parseFrame, frameLength[currentFrame]);
                            };

                            clearTimeout(currentCycle);
                            currentCycle = setTimeout(parseFrame, frameLength[0]);

                        } else {

                            const pixelData = getPixelDataFromImage(pixels.data);

                            afterImage(pixelData);
                        }

                    });
                });


        });

    });

    socket.on('openClock', function() {

        let colorIndex = 1;
        let reset = false;
        function rerenderClock() {

            const date = moment().add(1, 'second');

            const seconds = date.format('s');
            const hours = date.format('HH');
            const minutes = date.format('mm');

            let pixelData = createMultiFromData(screenData.pixelData);

            if (seconds == 1 && reset) {
                colorIndex = !colorIndex;
            }

            if (seconds == 59) {
                reset = true;
            }

            let secondsColor = screenData.clockColors[colorIndex + 1];

            function drawSeconds(data, seconds) {
                let pixelData = R.clone(data);

                const x = screenData.resolution.x;

                const maxRadius = Math.floor(x / 2);

                for (let radius = 1; radius <= maxRadius; radius++) {

                    const perimeter = 4 * (radius * 2 - 1) || 1;

                    let pixelsToColor = Math.round((perimeter / 60) * seconds) || 1;

                    for (var i = 1; i <= pixelsToColor; i++) {

                        if (radius === 1) {
                            if (i === 1) {
                                pixelData[maxRadius - 1][maxRadius] = secondsColor;
                            } else if (i === 2) {
                                pixelData[maxRadius][maxRadius] = secondsColor;
                            } else if (i === 3) {
                                pixelData[maxRadius][maxRadius - 1] = secondsColor;
                            } else {
                                pixelData[maxRadius - 1][maxRadius - 1] = secondsColor;
                            }

                            continue;
                        }

                        const topRight = radius;
                        const bottomRight = 3 * radius - 1; // 3 radiuses to right - 1
                        const bottomLeft = 5 * radius - 2; // 5 radiuses to right - 2 corners
                        const topLeft = 7 * radius - 3; // 7 radiuses to right - 3 corners

                        if (i <= topRight) {
                            pixelData[maxRadius - radius][maxRadius + i - 1] = secondsColor;
                        }

                        if (i > topRight && i <= bottomRight) {

                            const rightSide = i - topRight;

                            pixelData[maxRadius - radius + rightSide][maxRadius + radius - 1] = secondsColor;
                        }

                        if (i > bottomRight && i <= bottomLeft) {
                            const bottomSide = i - bottomRight;

                            pixelData[maxRadius + radius - 1][maxRadius + radius - bottomSide - 1] = secondsColor;
                        }

                        if (i > bottomLeft && i <= topLeft) {
                            const leftSide = i - bottomLeft;

                            pixelData[maxRadius + radius - 1 - leftSide][maxRadius - radius] = secondsColor;
                        }

                        if (i > topLeft) {
                            const topSide = i - topLeft;

                            pixelData[maxRadius - radius][maxRadius - radius + topSide] = secondsColor;
                        }
                    }

                }

                return pixelData;

            }

            if (seconds == 0) {
                pixelData = drawSeconds(pixelData, 60);
            } else {
                pixelData = drawSeconds(pixelData, seconds);
            }

            function drawNumber(data, number, topLeftX, topLeftY) {
                let pixelData = R.clone(data);

                let segments = numbers[number];

                for (var i = 0; i < 5; i++) {
                    for (var j = 0; j < 3; j++) {

                        const color = segments[i * 3 + j] ? screenData.clockColors[0] : pixelData[topLeftX + i][topLeftY + j];
                        pixelData[topLeftX + i][topLeftY + j] = color;
                    }
                }

                return pixelData;
            }

            pixelData = drawNumber(pixelData, Math.floor(hours / 10), 2, 4);
            pixelData = drawNumber(pixelData, hours % 10, 2, 9);
            pixelData = drawNumber(pixelData, Math.floor(minutes / 10), 9, 4);
            pixelData = drawNumber(pixelData, minutes % 10, 9, 9);


            return Object.assign(
                {},
                screenData,
                { pixelData: multiToSingle(pixelData) }
            );

            //screenData = Object.assign(
            //    {},
            //    screenData,
            //    { pixelData: multiToSingle(pixelData) }
            //);
            //
            //ws281x.render(screenData.pixelData);
            //
            //io.emit('afterImage', serialize(screenData));

        }

        function render() {
            screenData = Object.assign({}, data);

            ws281x.render(screenData.pixelData);

            io.emit('afterImage', serialize(screenData));

            currentCycle = setTimeout(render, 1000 - (+ new Date() % 1000));
            setTimeout(() => { data = rerenderClock() }, 0);


        }

        clearTimeout(currentCycle);

        let data = rerenderClock();

        currentCycle = setTimeout(() => {
            clearTimeout(currentCycle);
            currentCycle = setTimeout(render, 0);
        }, 1000 - (+ new Date() % 1000));

    });

    socket.on('reset', function () {

        setScreenData(Object.assign(
            {},
            screenData,
            { pixelData: new Uint32Array(NUM_LEDS) }
        ));

        ws281x.render(screenData.pixelData);

        io.emit('afterReset', serialize(screenData));
    });

    socket.on('onChangeClockColor', function(data) {
        const number = data.number || 0;

        const parsed = parseInt(data.color, 16);

        const color = !isNaN(parsed) ? parsed : 0xffffff;

        screenData.clockColors[number] = color;

    })

});


process.on('SIGINT', function () {
    ws281x.reset();
    io.emit('reset', screenData);
    process.nextTick(function () {
        process.exit(0);
    });
});

server.listen(1365);


