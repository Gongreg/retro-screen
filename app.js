var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var ws281x = require('rpi-ws281x-native');

var NUM_LEDS = 16;

var pixelData = new Uint32Array(NUM_LEDS);

var count = 0;

var brightness = 255;

ws281x.init(NUM_LEDS);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.route('/brightness')
    .post(function (req, res) {
        const newBrightness = parseInt(req.body.brightness);

        if (newBrightness >= 0 && newBrightness <= 255) {

            brightness = newBrightness;

            console.log(brightness);

            ws281x.setBrightness(newBrightness);
            ws281x.render(pixelData);


        }

        res.json({
            brightness: brightness
        });
    });

app.route('/data')
    .get(function (req, res) {
        res.json({
            data: pixelData,
            brightness: brightness,
        });
    })

app.route('/reset')
    .get(function (req, res) {
        pixelData = new Uint32Array(NUM_LEDS);
        ws281x.render(pixelData);
        res.send('ok');
    })


app.route('/draw')
    .get(function (req, res) {
        res.json({leds: pixelData});
    })
    .post(function (req, res) {
        const index = parseInt(req.body.index);
        const color = parseInt(req.body.color);

        pixelData[index] = color;

        ws281x.render(pixelData);

        res.send('ok');
    });

app.get('/test', function (req, res) {

    if (count === 16) {
        count = 0;
        pixelData = new Uint32Array(NUM_LEDS);
    }

    pixelData[count] = 0xFFFFFF;

    ws281x.render(pixelData);
    count++;

    res.send('test');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
