
const LOAD = 'redux-example/info/LOAD';
const LOAD_SUCCESS = 'redux-example/info/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/info/LOAD_FAIL';

console.log('>>>>>>>>>>>>> Redux > Modules > INFO.JS > 11 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

const initialState = {
  loaded: false
};

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

// ============================================================================================

export function isLoaded(globalState) {
  const iIL = globalState.info && globalState.info.loaded;
  console.log('>>>>>>>>>>>>> Redux > Modules > INFO.JS > isInfoLoaded(): ', iIL);
  return iIL;
}

export function load() {
  const lI = ({ client }) => client.get('/load-info');
  console.log('>>>>>>>>>>>>> Redux > Modules > INFO.JS > loadInfo(): ', lI);
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: lI
  };
}

// ============================================================================================
