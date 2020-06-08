import React from "react";
//import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";

class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       selectedRouteKey: null
    }
  }

  onClick = () => {
      const {route, selectedRouteKey} = this.props;
      if (selectedRouteKey && route.routeKey === selectedRouteKey) {
             return
      }
      this.props.setSelectedRouteKey(route.routeKey);
  }
  
  render() {
    const {route, selectedRouteKey} = this.props;
    const name = "Route Name : " + route.routeName;
    const explanation = "Explanation : " + route.explanation;
    const password = "Password : " + route.routePassword;
    const selected = route && selectedRouteKey ? route.routeKey === selectedRouteKey : false;
   
    return (
      <Menu.Menu style={selected? {...styles.container,backgroundColor:"rgba(0,255,0,0.1)"} :
                 styles.container} onClick={() => this.onClick()}>
         <Menu.Item style={styles.name}>
              {route && name}
         </Menu.Item>
         <Menu.Item style={styles.item}>
              {route && explanation }
         </Menu.Item>
         <Menu.Item style={styles.item}>
              {route && password }
         </Menu.Item>
         </Menu.Menu>
     );
   }
}
const styles = {
  container: {
    paddingTop: "2px",
    paddingBottom: "2px",
    position: "relative",
    borderStyle:"solid",
    borderWidth:"4px",
    borderColor:"#e8eef7",
    marginTop: "1px",
    marginBottom: "1px"
  },
  name: {
    opacity: 1.0,
    color: "black",
    fontSize: "1.0em",
    fontWeight: "bold",
    paddingTop:"5px",
    paddingBottom:"5px",
    paddingLeft: "15px"
  },
  item: {
    opacity: 1.0,
    color: "black",
    fontSize: "1.0em",
    fontWeight: "normal",
    paddingTop:"2px",
    paddingBottom:"2px",
    paddingLeft: "15px"
  }
};

export default Route
