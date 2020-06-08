import * as actionTypes from "./types";

export const setServerError = error => {
  //console.log("at actions")
  //console.log (error)
  return {
    type: actionTypes.SET_SERVER_ERROR,
    payload: {
        serverError: error
    }
  }
}

export const setWimdUser = user => {
  //console.log("at actions setWimdData")
  //console.log (data)
  return {
    type: actionTypes.SET_WIMD_USER,
    payload: {
        wimdUser: user
    }
  }
}

export const setSelectedRoutekey = key => {
  console.log("at actions setSelectedRoutekey")
  console.log (key)
  return {
    type: actionTypes.SET_SELECTED_ROUTE_KEY,
    payload: {
        selectedRouteKey: key
    }
  }
}

