const R = require('ramda');


function shouldReverse(rowIndex) {
    return rowIndex % 2 == 0;
}

function serialize(screenData) {

    const x = screenData.resolution.x;

    //split into arrays of rows

    const rows = R.splitEvery(x, screenData.pixelData);

    //rotate every second array
    const sortedRows = rows.map(
        (ledRow, rowIndex) => shouldReverse(rowIndex) ? R.reverse(ledRow) : R.values(ledRow)
    );

    return Object.assign(
        {},
        screenData,
        { pixelData: sortedRows }
    );
}

function calculateIndex(resolution, coordinates) {
    const rowIndex = shouldReverse(coordinates.y) ? resolution.x - 1 - coordinates.x : coordinates.x;

    return coordinates.y * resolution.x + rowIndex;
}

function clearTimeouts(timeouts) {
    R.mapObjIndexed(clearTimeout, timeouts);
}

function sortRows(rows) {

    return rows.map((ledRow, rowIndex) => {

        //if it is an object, make an array
        const ledArray = Array.isArray(ledRow) ? ledRow: R.values(ledRow);

        return shouldReverse(rowIndex) ? R.reverse(ledRow) : ledRow;
    });
}

function createEmptyMulti(resolution, color = 0) {
    return R.range(0, resolution.y).map(
        () => R.range(0, resolution.x).map(R.always(color))
    );
}

function multiToSingle(multi) {
    return R.flatten(sortRows(multi));
}

module.exports = {
    shouldReverse,
    serialize,
    calculateIndex,
    clearTimeouts,
    sortRows,
    createEmptyMulti,
    multiToSingle
};