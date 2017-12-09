const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const app = express();
const spotify = require('./server/spotify/spotify');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'server/views'));

app.engine('html', ejs.renderFile);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', function (req, res) {
  res.render('index.html');
});

spotify.connect();

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

function cleanup() {

  screenController.exit();
  io.emit('exit');

  process.nextTick(function () {
    process.exit(0);
  });
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

