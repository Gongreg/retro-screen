module.exports = function initRoutes(io) {

    io.on('connection', function (socket) {

        console.log('user connected');

        socket.emit('init', require('./routes/init')());

        require('./routes/brightness')(io, socket);

        require('./routes/draw')(io, socket);

        require('./routes/reset')(io, socket);

        require('./routes/image-upload')(io, socket);

        require('./routes/clock')(io, socket);
        require('./routes/clock-color')(io, socket);

        socket.on('disconnect', function () {
            console.log('user disconnected');
        });

    });

};