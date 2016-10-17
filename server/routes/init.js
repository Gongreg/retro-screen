const screenController = require('../screen-controller');
const youtubeController = require('../youtube-controller');

module.exports = () => {
    return {
        screenData: screenController.getSerializedScreenData(),
        musicSearchResults: youtubeController.getResults(),
    };
};