import React from "react";
import ReactDOM from "react-dom";
import firebase from "./firebase";
import Login from "./Login";
import Register from "./Register";
import registerServiceWorker from "./registerServiceWorker";
import RouteTrack from './RouteTrack';
import "semantic-ui-css/semantic.min.css";
import RouteLogin from "./RouteLogin"
import UserRoutes from "./UserRoutes"
import WebError from "./WebError"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import {  setServerError } from "./actions";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  state = {
  };

  componentDidMount() {
    firebase
    .auth()
    .signInWithEmailAndPassword("mr.guoping.wu@gmail.com", "@Kirkland!Montreal0407")
    .then(signedInUser => {
      console.log("firebase login info : ")
      console.log (signedInUser.user) ;
      this.props.history.push("/");
    })
    .catch(err => {
      console.error(err);
      this.props.setServerError({subject: "server failure", content: "server access failed"});
      this.props.history.push("/error");
    });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={RouteLogin} />
        <Route exact path="/error" component={WebError} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/routes" component={UserRoutes} />
        <Route path="/map" component={RouteTrack} />
      </Switch> 
    );
  }
}

const mapStateToProps = state => ({

});

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    {setServerError}
  )(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
