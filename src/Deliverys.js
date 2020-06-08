import React from "react";
//import { connect } from "react-redux";
import { Menu, Icon} from "semantic-ui-react";
import Delivery from "./Delivery";
import AddDeliveryModal from "./AddDeliveryModal";

class Deliverys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       routes: [],
       selectedRouteKey: null
    }
  }

  static getDerivedStateFromProps(props, prevState) {
    return {routes: props.routes, selectedRouteKey: props.selectedRouteKey};
  }

  displayDeliverys = deliverys =>
      deliverys.length > 0 &&
      deliverys.map(delivery => (
          <Delivery key={delivery.deliveryKey} 
                    delivery={delivery} 
                    selectedRouteKey = {this.state.selectedRouteKey}/>
     ));

  render() {
    const {routes, selectedRouteKey} = this.props;

    let routeKey = null;
    const deliveryArray =[];
    
    if (routes && routes.length > 0 && selectedRouteKey) {
        routeKey = selectedRouteKey ;
        console.log("deliverys render(): routeKey ")
        console.log(routeKey);
        var i;
        for (i = 0; i < routes.length; i++) {
            if (routes[i].routeKey  === selectedRouteKey) {
                for (var key in routes[i].deliverys) {
                       deliveryArray.push ({...routes[i].deliverys[key]})
                }
             }  
        }
    }
    
    let titleString = "Deliveries";
    let modalString = "add new delivery";
   
    return (
      <Menu.Menu style= {styles.container}>
            <Menu.Header style= {styles.menuHeader}>
                {titleString}
            </Menu.Header>
           <Menu.Menu style= {styles.menuMenu} >
              {this.displayDeliverys(deliveryArray)}
              <Menu.Item style={{margin:"3px"}}>            
                   <span style={{color:"black", fontWeight:"bold"}}> {modalString}</span> <AddDeliveryModal routeKey = {routeKey}/>
              </Menu.Item>
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
    paddingTop:"15px",
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

export default Deliverys
