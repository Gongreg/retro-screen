const screenController = require('./screen-controller');
const utils = require('./utils');
module.exports = function initRoutes(io) {

  io.on('connection', function (socket) {

    console.log('user connected');

    socket.emit('init', require('./routes/init')());

    require('./routes/brightness')(io, socket);

    require('./routes/draw')(io, socket);

    require('./routes/reset')(io, socket);

    require('./routes/image-upload')(io, socket);

    require('./routes/clock')(io, socket);
    require('./routes/text')(io, socket);

    require('./routes/music')(io, socket);

    require('./routes/shutdown')(io, socket);

    require('./routes/scripts')(io, socket);

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

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

    socket.on('music', (data) => {

      const splitData = data.split(',').slice(0, 16).map(i => parseInt(i, 10));

      if (splitData.length === 0 || isNaN(splitData[0])) {
        return;
      }

      const emptyMulti = utils.createEmptyMulti({x: 16, y: 16});

      const coloredMulti = emptyMulti.map((row, y) => {
        return row.map((element, x) => {
          if (16 - y <= splitData[x]) {
            return colors[15 - y];
          }

          return 0;
        })
      });


      const ledCount = splitData.reduce((acc, x) => acc + x, 0);

      const brightness = Math.round(ledCount / 255 * 100) + 30;

      screenController.setScreenState({
        pixelData: utils.multiToSingle(coloredMulti),
        brightness: brightness > 100 ? 100 : brightness,
      });

      //io.emit('newState', screenController.getSerializedScreenData());

    });
  });

};
