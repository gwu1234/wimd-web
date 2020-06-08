import { combineReducers } from "redux";
import * as actionTypes from "../actions/types";

const GEOCODING_DONE = 1;


const initialUserState = {
  isLoading: true,
  serverError : null,
  wimdUser: null,
  selectedRouteKey: null
};

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    
  case actionTypes.SET_SERVER_ERROR:
    return {
        ...state,
        serverError: action.payload.serverError
  };

  case actionTypes.SET_WIMD_USER:
    return {
        ...state,
        wimdUser: action.payload.wimdUser
  };

  case actionTypes.SET_SELECTED_ROUTE_KEY:
    return {
        ...state,
        selectedRouteKey: action.payload.selectedRouteKey
  };
  
  default:
      return state;
  }
};


/*const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer
});*/

const rootReducer = combineReducers({
  user: user_reducer

});

export default rootReducer;
