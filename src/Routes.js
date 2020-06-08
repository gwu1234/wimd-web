import React from "react";
//import firebase from "./firebase";
//import { connect } from "react-redux";
import { Menu, Icon} from "semantic-ui-react";
import Route from "./Route";
import AddRouteModal from "./AddRouteModal";

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       routes: [],
       wimdUser: null
    }
  }

  static getDerivedStateFromProps(props, prevState) {
    return {routes: props.routes, wimdUser: props.wimdUser};
  }

  displayRoutes = routes =>
   routes.length > 0 &&
   routes.map(route => (
       <Route key={route.routeKey} route ={route} 
              selectedRouteKey ={this.props.selectedRouteKey}
              setSelectedRouteKey={(k)=>this.setSelectedRouteKey(k)}/>
  ));

  setSelectedRouteKey(key) {
    //console.log("at Routes setSelectedRouteKey");
    //this.setState({selectedRouteKey: key});
    this.props.setSelectedRouteKey(key);
 }

  render() {
    const {routes, wimdUser} = this.state;
    return (
      <Menu.Menu style={styles.container}>
            <Menu.Header style={styles.menuHeader}>
                Routes
                <AddRouteModal open={false} wimdUser={wimdUser}/>
            </Menu.Header>
          <Menu.Menu style={styles.menuMenu} >
              {this.displayRoutes(routes)}
          </Menu.Menu>
      </Menu.Menu>
    );
  }
}

const styles = {
  container: {
    height: "100%",
    background: "#f2f4f7",
  },
  menuHeader: {
    paddingTop:"8px",
    paddingBottom: "8px",
    textAlign: "center",
    color: "black",
    fontSize:"1.1em",
    fontWeight:"bold",
    height: "7%",
  },
  menuMenu: {
    position: "relative",
    overflow: "scroll",
    height: "93%",
  },
}
export default Routes;
