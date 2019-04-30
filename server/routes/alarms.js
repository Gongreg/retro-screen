const screenController = require('../screen-controller');

module.exports = function (io, socket) {


  socket.on('removeAlarm', function (k) {

    require('../alarms').removeAlarm(k);

    io.emit('afterReset', screenController.getSerializedScreenData());
  });


  socket.on('setAlarms', function (newAlarm) {

    let days = '';
    Object.keys(newAlarm.days).map(d => {
      if (newAlarm.days[d]) {
        days = days + d + ',';
      }
    });

    if (!days) {
      days = '*';
    } else {
      days = days.slice(0, days.length - 1);
    }

    const format = `${newAlarm.hour.minute} ${newAlarm.hour.hour} * * ${days}`;

    const alarms = screenController.getScreenData().alarms || {};

    alarms[newAlarm.name] = format;

    require('../alarms').setAlarms(alarms);

    io.emit('afterReset', screenController.getSerializedScreenData());
  });

};
