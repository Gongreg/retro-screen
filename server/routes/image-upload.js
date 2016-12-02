const gm = require('gm').subClass({ imageMagick: true });
const getPixels = require('get-pixels');

const screenController = require('../screen-controller');

const { getPixelDataFromImage, imagePixelsToPixelData } = require('../parse-images/utils');

module.exports = function (io, socket) {

    function gifCycle(pixels, frameLength) {

        let currentFrame = 0;

        const parseFrame = function () {

            const dataLength = pixels.length / frameLength.length;

            const imageData = pixels.slice(dataLength * currentFrame, dataLength * (currentFrame + 1));

            const pixelData = getPixelDataFromImage(imageData);

            afterImage(pixelData);

            currentFrame++;
            if (currentFrame === frameLength.length) {
                currentFrame = 0;
            }

            screenController.setTimeout('gifCycle', setTimeout(parseFrame, frameLength[currentFrame]));
        };

        parseFrame();
    }

    function afterImage(pixelData) {
        screenController.reset();
        screenController.setScreenState(
            {
                pixelData: imagePixelsToPixelData(pixelData, screenController.getScreenData().resolution)
            }
        );

        io.emit('newState', screenController.getSerializedScreenData());
    }

    socket.on('imageUpload', function ({file, name = 'super-awesome-image'}) {

        const gmFile = gm(file);

        gmFile.identify(function (err, data) {

            if (err) {
                console.log('imageUploadIdentifyError' + err);
                return;
            }

            const extension = data.format.toLowerCase();

            const frameLength =
                data.Delay && data.Delay.map((length) => {

                    const percentOfSecond = length.substring(0, length.lastIndexOf('x'));
                    return parseInt(percentOfSecond, 10) * 10 || 100;
                }) || [];

            const { x, y } = screenController.getScreenData().resolution;

            gmFile
                .coalesce()
                .scale(x, y)
                .gravity('Center')
                .background('black')
                .extent(x, y)
                .toBuffer(extension, (err, buffer) => {

                    if (err) {
                        console.log('gmFileToBufferError', err);
                        return;
                    }

                    getPixels(buffer, 'image/' + extension, (err, pixels) => {

                        if (err) {
                            console.log('getPixelsError', err);
                            return;
                        }

                        //gif!
                        if (frameLength.length > 0) {
                            gifCycle(pixels.data, frameLength);
                        } else {

                            const pixelData = getPixelDataFromImage(pixels.data);
                            afterImage(pixelData);
                        }

                    });
                });
        });
    });

};
