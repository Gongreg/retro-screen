import R from 'ramda';

import parseColor from 'parse-color/parse-color';

export default {
    parseScreenData: screenData => ({
        ...screenData,
        clockColors: toHexString(screenData.clockColor)
    }),
}