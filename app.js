const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const http = require('http');

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/server/views');

app.engine('html', ejs.renderFile);

app.use(express.static('public'));

app.get('/*', function (req, res) {
    res.render('index.html');
});

const server = http.createServer(app);
server.listen(1365);

const screenController = require('./server/screen-controller');
screenController.init({
    leds: 256,
    resolution: {
        x: 16,
        y: 16,
    },
    defaultBrightness: 100,
    maxBrightness: 255,
    fps: 60,

});


const io = require('socket.io')(server);
const initRoutes = require('./server/io');
initRoutes(io);
const utils = require('./server/utils');

var fs = require("fs");
var net = require("net");

const colors = [
0x4040ff,
0x2a59fc,
0x04a6d5,
0x03d2aa,
0x12ee7f,
0x2dfc55,
0x59fc2a,
0xa6d503,
0xd2aa03,
0xee7f12,
0xfc552d,
0xfc2a58,
0xd503a6,
0xaa03d2,
0xa504d6,
0x7f12ee,
];

var unixServer = net.createServer((c) => {
    // 'connection' listener
    console.log('client connected');
    c.on('end', () => {
        console.log('client disconnected');
    });

    c.on('data', (e) => {

        const data = e.toString('utf8');

        const splitData = data.split(',').slice(0, 16).map(i => parseInt(i, 10));

        if (splitData.length == 0) {
            return;
        }

        const emptyMulti = utils.createEmptyMulti({x: 16, y: 16});

        const coloredMulti = emptyMulti.map((row, y) => {
            return row.map((element, x) => {
                if (16 - y <= 1 + splitData[x]) {
                    return colors[16 - y];
                }

                return 0;
            })
        });

        screenController.setScreenState({
            pixelData: utils.multiToSingle(coloredMulti),
        });

        io.emit('newState', screenController.getSerializedScreenData());
    });
});

unixServer.listen('/tmp/testas');


process.on('SIGINT', function () {

    screenController.exit();
    io.emit('exit');

    process.nextTick(function () {
        process.exit(0);
    });
});

