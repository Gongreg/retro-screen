const screenController = require('./screen-controller');
const schedule = require('node-schedule');

let jobs = [];

module.exports = {
  setAlarms(alarms) {
    require('./store').set('alarms', alarms);

    screenController.setScreenState({alarms});

    this.loadAlarms(alarms);
  },

  removeAlarm(k) {
    const alarms = screenController.getScreenData().alarms;

    delete alarms[k];

    screenController.setScreenState({alarms});

    this.loadAlarms(alarms);
  },

  getAlarms() {
    const alarms = require('./store').get('alarms') || {};

    this.loadAlarms(alarms);

    return alarms;
  },

  runAlarm() {
    let pixelData = screenController.getScreenData().pixelData;
    pixelData = pixelData.map(() => 0xFFFCAA);
    screenController.clearTimeouts();

    let counter = 0;
    function cycle() {
      screenController.setTimeout('alarm', setTimeout(() => {
        screenController.clearTimeouts();
        screenController.setScreenState({ pixelData, brightness: counter });

        counter++;

        if (counter >= 200) {
          return;
        }

        cycle();

        }, 3000));

    }

    cycle();
    console.log('alarm!');
  },

  loadAlarms(alarms) {
    if (jobs.length > 0) {
      jobs.map(j => j.cancel());

      jobs = [];
    }

    if (Object.keys(alarms).length > 0) {
      Object.keys(alarms).map(a => {
        const j = schedule.scheduleJob(alarms[a], this.runAlarm);

        jobs.push(j);
      })
    }
  }
}
