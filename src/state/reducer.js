import * as actionTypes from './action-types';
import * as R from 'ramda';

const initialState = {
  screenData: {
    pixelData: [],
    textColors: [],
    clockColors: [],
    resolution: {
      x: 0,
      y: 0,
    },
    brightness: 0,
    maxBrightness: 0,
    textSpeed: 0,
  },
  loading: true,
  scriptError: null,
};


const setAllElementsToZero = (x) => R.pipe(
  R.flatten,
  R.map(R.always(0)),
  R.splitEvery(x)
);


export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ON_INIT: {
      console.log(action.screenData);

      return {
        ...state,
        screenData: action.screenData,
        loading: false,
      };
    }
    case actionTypes.ON_NEW_STATE: {
      return {
        ...state,
        screenData: action.screenData,
      };
    }
    case actionTypes.ON_DRAW: {
      const {x, y} = action.coordinates;

      return R.assocPath(['screenData', 'pixelData', y, x], action.color, state);
    }
    case actionTypes.AFTER_DRAW: {

      const {x, y} = action.coordinates;

      if (state.screenData.pixelData[y][x] === action.color) {
        return state;
      }

      return R.assocPath(['screenData', 'pixelData', y, x], action.color, state);
    }
    case actionTypes.ON_CHANGE_CLOCK_COLOR: {
      return R.assocPath(['screenData', 'clockColors', action.number], action.color, state);
    }
    case actionTypes.ON_CHANGE_TEXT_COLOR: {
      return R.assocPath(['screenData', 'textColors', action.number], action.color, state);
    }
    case actionTypes.ON_CHANGE_TEXT_SPEED: {
      console.log(action.textSpeed);
      return R.assocPath(['screenData', 'textSpeed'], action.textSpeed, state);
    }
    case actionTypes.AFTER_BRIGHTNESS: {
      let oldBrightness = state.screenData.brightness;

      if (oldBrightness === action.brightness) {
        return state;
      }

      return R.assocPath(['screenData', 'brightness'], action.brightness, state);
    }
    case actionTypes.ON_RESET: {
      return R.assocPath(['screenData', 'pixelData'], setAllElementsToZero(state.screenData.resolution.x)(state.screenData.pixelData), state);
    }
    case actionTypes.ON_CHANGE_BRIGHTNESS: {
      return R.assocPath(['screenData', 'brightness'], action.brightness, state);
    }
    case actionTypes.SCRIPT_ERROR: {
      return R.assoc('scriptError', action.error, state);
    }
    default:
      return state;
  }
}
