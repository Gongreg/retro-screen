const {spawn} = require('child_process');
const cprocess = spawn('/home/pi/projects/cli-visualizer/build/vis');


const io = require('socket.io-client');

const socket = io('http://localhost:1365');

cprocess.stdout.on('data', function (buffer) {
  const data = buffer.toString('utf8');

  socket.emit('music', data);
});
