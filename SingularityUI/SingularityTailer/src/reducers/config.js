import {
  SANDBOX_SET_API_ROOT,
  TOGGLE_ANSI_COLORING,
  TOGGLE_FETCH_OVERSCAN
} from '../actions';

const initialState = {
  parseAnsi: true,
  fetchOverscan: true
};

const configReducer = (state = initialState, action) => {
  switch (action.type) {
    case SANDBOX_SET_API_ROOT:
      return {
        ...state,
        singularityApiRoot: action.apiRoot
      };
    case TOGGLE_ANSI_COLORING:
      return {
        ...state,
        parseAnsi: !state.parseAnsi
      };
    case TOGGLE_FETCH_OVERSCAN:
      return {
        ...state,
        fetchOverscan: !state.fetchOverscan
      };
    default:
      return state;
  }
};

export default configReducer;