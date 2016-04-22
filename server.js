"use strict";

const R = require('ramda');

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(function(req, res, next) {
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
};

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

const ws281x = require('rpi-ws281x-native');

ws281x.init(NUM_LEDS);
ws281x.render(screenData.pixelData);
ws281x.setBrightness(screenData.brightness);
ws281x.render(screenData.pixelData);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.emit('init', serialize(screenData));

    socket.on('brightness', function(brightness) {
        const newBrightness = parseInt(brightness);

        if (newBrightness >= 0 && newBrightness <= 100) {

            screenData = Object.assign(
                {},
                screenData,
                { brightness: newBrightness }
            );

            ws281x.setBrightness(screenData.brightness);
            ws281x.render(screenData.pixelData);

        }

        io.emit('afterBrightness', brightness);
    });

    socket.on('draw', function(data){

        const {x, y} = data.coordinates;

        if (x < 0 || x >= screenData.resolution.x || y < 0 || y > screenData.resolution.y ) {
            return;
        }

        const color = data.color;

        if (color < 0 || color > 0xffffff) {
            return;
        }

        let pixelData = screenData.pixelData;
        pixelData[y][x] = data.color;

        screenData = Object.assign(
            {},
            screenData,
            { pixelData: pixelData }
        );

        ws281x.render(screenData.pixelData);

        io.emit('afterDraw', data);
    });

    socket.on('image', function(data) {
        screenData = Object.assign(
            {},
            parse(data)
        );

        ws281x.render(screenData.pixelData);

        io.emit('afterImage', serialize(screenData));
    });


    socket.on('reset', function() {
        screenData = Object.assign(
            {},
            screenData,
            { pixelData: new Uint32Array(NUM_LEDS) }
        );

        ws281x.render(screenData.pixelData);

        io.emit('afterReset', serialize(screenData));
    });

});


process.on('SIGINT', function () {
    ws281x.reset();
    io.emit('reset', screenData);
    process.nextTick(function () { process.exit(0); });
});

server.listen(1365);


