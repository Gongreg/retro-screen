const ws281x = require('rpi-ws281x-native');

const { serialize, clearTimeouts } = require('./utils');

const screenController = {

    initialState: {},

    //example of state
    //state: {
    //    screenData: {
    //        leds: 256,
    //        resolution: {
    //            x: 16,
    //            y: 16,
    //        },
    //        pixelData: new Uint32Array(256),
    //        brightness: 100,
    //        maxBrightness: 255,
    //        clockColors: [0x4A90E2, 0xD0021B, 0xF8E71C],
    //    },
    //    rerender: false,
    //    fps: 60,
    //    timeout: 0,
    //    renderTimeout: null,
    //    nextRender: 0,
    //    timeouts: {},
    //},

    init({ leds, resolution, maxBrightness, defaultBrightness, fps }) {

        const timeout = 1000 / fps;

        const initialState = {
            screenData: {
                leds,
                resolution,
                pixelData: new Uint32Array(leds),
                brightness: defaultBrightness,
                maxBrightness,
                clockColors: [0x4A90E2, 0xD0021B, 0xF8E71C],
            },
            rerender: true,
            fps,
            timeout,
            nextRender: +new Date,
            timeouts: {},
        };

        this.initialState = initialState;
        this.state = initialState;

        ws281x.init(this.state.screenData.leds);

        this.render();
    },

    setState(state, rerender = true) {
        this.state = Object.assign(
            {},
            this.state,
            state,
            { rerender }
        );
    },

    setScreenState(screenData, rerender = true) {

        this.state.screenData = Object.assign(
            {},
            this.state.screenData,
            screenData
        );

        this.state.rerender = rerender;
    },

    render() {
        if (this.state.rerender) {
            this.state.rerender = false;

            ws281x.setBrightness(this.state.screenData.brightness);
            ws281x.render(this.state.screenData.pixelData);
        }

        const now = +new Date;
        const late = now > this.state.nextRender ? now - this.state.nextRender : 0;
        const nextRender = now + this.state.timeout - late;

        this.state.nextRender = nextRender;
        this.state.timeouts.render = setTimeout(this.render.bind(this), nextRender);
    },

    exit() {
        ws281x.reset();
        clearTimeouts(this.state.timeouts);
    },

    getScreenData() {
        return this.state.screenData;
    },

    getSerializedScreenData() {
        return serialize(this.state.screenData);
    },

    clearTimeouts() {
        clearTimeouts(this.state.timeouts);
    },

    reset() {
        clearTimeouts(this.state.timeouts);

        this.setState({
            screenData: this.initialState.screenData,
            timeouts: {},
        });
    },

    setTimeout(name, timeout) {
        this.state.timeouts[name] = timeout;
    }
};

module.exports = screenController;