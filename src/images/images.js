import React, { PropTypes } from 'react';
import R from 'ramda';
import Dropzone from 'react-dropzone';

export default React.createClass({
    displayName: 'ScreenTest',

    propTypes: {
        onUploadImage: PropTypes.func,
        screenData: PropTypes.object,
        loading: PropTypes.bool,
    },

    getInitialState() {
        return {
            file: {},
        };
    },

    onDrop: function (files) {

        const file = files[0];

        const { x, y } = this.props.screenData.resolution;

        let image = new Image(x, y);

        image.onload = () => {

            let canvas = document.createElement('canvas');
            canvas.width = x;
            canvas.height = y;

            let context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, x, y);
            const imageData = context.getImageData(0, 0, x, y);

            const fixedData = R.splitEvery(4, imageData.data).map((data) => {
                let rgb = data[0];
                rgb = (rgb << 8) + data[1];
                rgb = (rgb << 8) + data[2];

                return rgb;
            });

            const ledsArray = R.splitEvery(x, fixedData);

            this.props.onUploadImage(ledsArray);
        };

        image.src = file.preview;

    },

    render() {

        if (this.props.loading) {
            return (
                <div>
                    <h1>Images</h1>
                    Loading
                </div>
            );
        }

        return (
            <div>
                <h1>Images</h1>
                <Dropzone
                    style={{
                        width: '500px',
                        height: '100px',
                        border: '2px dashed #666',
                    }}
                    onDrop={ this.onDrop }
                    multiple={ false }
                >
                    <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>
            </div>
        );
    },
});

