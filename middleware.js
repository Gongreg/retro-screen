const {spawn} = require('child_process');

const cprocess = spawn('/home/pi/projects/cli-visualizer/build/vis');

const io = require('socket.io-client');

const socket = io('http://localhost:1365');

let visualizerEnabled = false;

socket.on('init', ({screenData}) => {
  visualizerEnabled = screenData.visualizerEnabled;
});

socket.on('afterVisualizerEnabled', (enabled) => {
  visualizerEnabled = enabled;
});

cprocess.stdout.on('data', function (buffer) {
  if (visualizerEnabled) {
    const data = buffer.toString('utf8');
    socket.emit('music', data);
  }
});


function cleanup() {
  try {
    cprocess.kill();
  } catch (e) {
    console.error('Failed to kill vis', e);
  }

  process.nextTick(function () {
    process.exit(0);
  });
}

//process.on('SIGINT', cleanup);
//process.on('SIGTERM', cleanup);
