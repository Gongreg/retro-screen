import * as actionTypes from './action-types';
import * as R from 'ramda';

const initialState = {
  screenData: {
    pixelData: [],
    resolution: {
      x: 0,
      y: 0,
    },
    brightness: 0,
    maxBrightness: 0,
  },
  loading: true,
};


const setAllElementsToZero = (x) => R.pipe(
  R.flatten,
  R.map(R.always(0)),
  R.splitEvery(x)
);


export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ON_INIT: {
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
    case actionTypes.AFTER_BRIGHTNESS: {
      let oldBrightness = state.screenData.brightness;

      if (oldBrightness === action.brightness) {
        return state;
      }

      return R.assocPath(['screenData', 'brightness'], action.brightness, state);
    }
    case actionTypes.AFTER_VISUALIZER_ENABLED: {
      let previousEnabled = state.screenData.visualizerEnabled;

      if (previousEnabled === action.visualizerEnabled) {
        return;
      }

      return R.assocPath(['screenData', 'visualizerEnabled'], action.visualizerEnabled, state);
    }
    case actionTypes.ON_RESET: {
      return R.assocPath(['screenData', 'pixelData'], setAllElementsToZero(state.screenData.resolution.x)(state.screenData.pixelData), state);
    }
    case actionTypes.ON_CHANGE_BRIGHTNESS: {
      return R.assocPath(['screenData', 'brightness'], action.brightness, state);
    }
    case actionTypes.ON_CHANGE_VISUALIZER_ENABLED: {
      return R.assocPath(['screenData', 'visualizerEnabled'], !state.screenData.visualizerEnabled, state);
    }
    default:
      return state;
  }
}
