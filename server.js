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
};

function setScreenData(data) {
    screenData = data;
    clearTimeout(currentCycle);
}


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


    socket.on('reset', function () {


        setScreenData(Object.assign(
            {},
            screenData,
            { pixelData: new Uint32Array(NUM_LEDS) }
        ));

        ws281x.render(screenData.pixelData);

        io.emit('afterReset', serialize(screenData));
    });

});


process.on('SIGINT', function () {
    ws281x.reset();
    io.emit('reset', screenData);
    process.nextTick(function () {
        process.exit(0);
    });
});

server.listen(1365);


