var ClientStream = require('openpixelcontrol-stream').OpcClientStream,
    net = require('net');

var NUM_LEDS = 16,
    OPC_CHANNEL = 0;

var client = new ClientStream();

var socket = net.createConnection(7890, '192.168.1.209', function() {
    client.pipe(socket);

    run();
});


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '0x';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;


}


function run() {
    // create a typed-array for color-data
    var data = new Uint32Array(NUM_LEDS);

    setInterval(function () {

        for (var i = 0; i < 16; i++) {

            data[i] = getRandomColor();
        }

        client.setPixelColors(OPC_CHANNEL, data);

    }, 1000);

}


process.on('SIGINT', function () {
    var data = new Uint32Array(NUM_LEDS);
    client.setPixelColors(OPC_CHANNEL, data);
    process.nextTick(function () { process.exit(0); });
});
