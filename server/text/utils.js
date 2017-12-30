const letters = require('./data');

const {createEmptyMulti, multiToSingle} = require('../utils');

function drawLetter(data, color, letter, {topX, topY}, {x, y}) {
  let pixelData = data;

  const segments = letters[letter] || letters[' '];

  //height
  for (let i = 0; i < 7; i++) {
    //width
    for (let j = 0; j < 3; j++) {
      //if this pixel is taken in number, color it, otherwise leave the same color.
      if (segments[i * 3 + j]) {
        const posY = topY + i;
        const posX = topX + j;
        if (posX >= 0 && posX < x && posY >= 0 && posY < y) {
          pixelData[posY][posX] = color;
        }
      }
    }
  }

  return pixelData;
}


function getMoveXAmount(index, width) {

  if (index <= width) {
    return width - index;
  }
  return (-1) * (index % 4);
}

function getCurrentLetterIndex(index, width) {
  const calculated = Math.floor((index - width) / 4);

  return calculated < 0 ? 0 : calculated;
}

function getTextState(screenData, currentLetterCycle) {

  const [textColor, backgroundColor] = screenData.textColors;
  const {text} = screenData;

  let pixelData = createEmptyMulti(screenData.resolution, backgroundColor);

  const currentLetterIndex = getCurrentLetterIndex(currentLetterCycle, screenData.resolution.x);
  const letterRemaining = text.length - currentLetterIndex;
  const letterCount = Math.min(5, letterRemaining);
  const moveX = getMoveXAmount(currentLetterCycle, screenData.resolution.x);

  for (let i = 0; i < letterCount; i++) {
    pixelData = drawLetter(pixelData, textColor, text[currentLetterIndex + i], {
      topX: (4 * i) + moveX,
      topY: 5
    }, screenData.resolution);
  }

  return multiToSingle(pixelData);
}

function shouldReset(screenData, currentLetterCycle) {
  const {text} = screenData;
  const currentLetterIndex = getCurrentLetterIndex(currentLetterCycle, screenData.resolution.x);
  const letterRemaining = text.length - currentLetterIndex;

  return letterRemaining === 0;
}

module.exports = {
  getTextState,
  shouldReset,
};
