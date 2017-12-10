const screenController = require('../screen-controller');

module.exports = () => {
    return {
        screenData: screenController.getSerializedScreenData(),
    };
};
