import React from "react";
import firebase from "./firebase";
import Geocode from "react-geocode";
import { connect } from "react-redux";
import { Menu} from "semantic-ui-react";

class Delivery extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
       }
   }

   componentDidMount() {
      const { delivery, selectedRouteKey } = this.props;
      if (!delivery.lng || !delivery.lat) {
        const newDelivery = {
        }
        const deliveryPath = "routes/" + selectedRouteKey + "/deliverys/" + delivery.deliveryKey ;
        //console.log(deliveryPath);
        const deliveryRef = firebase.database().ref(deliveryPath);
        const address = delivery.street + ", " + delivery.city + ", " + delivery.postcode;
        const location = {
           address: address,
           deliveryRef: deliveryRef
        }
        Delivery.getLocations (newDelivery,location);
      }
   }

   static getDerivedStateFromProps(props, prevState) {
    const { delivery, selectedRouteKey } = props;
      if (!delivery.lng || !delivery.lat) {
        const newDelivery = {
        }
        const deliveryPath = "routes/" + selectedRouteKey + "/deliverys/" + delivery.deliveryKey ;
        //console.log(deliveryPath);
        const deliveryRef = firebase.database().ref(deliveryPath);
        const address = delivery.street + ", " + delivery.city + ", " + delivery.postcode;
        const location = {
           address: address,
           deliveryRef: deliveryRef
        }
        Delivery.getLocations (newDelivery,location);
      }
    return {};
  }

  static async getLocations(delivery, location) {
    Geocode.setApiKey("abc12345");
      const r = await Delivery.getLocation(location)
      if (r != null) {
          delivery.lng = r.lng;
          delivery.lat = r.lat;
          location.deliveryRef.update(delivery);
      }
  }

  static async getLocation(location) {
    try {
      let response = await Geocode.fromAddress(location.address);
      //console.log("RESULT:", location.address, await response.results[0].geometry.location);
      return (
        {
          lat: await response.results[0].geometry.location.lat,
          lng: await response.results[0].geometry.location.lng
        }
      );
    }
    catch(err) {
      console.log("Error fetching geocode lat and lng:", err);
    }
    return null;
  } 

  render() {
    const {delivery} = this.props;
    const street = "Street : " + delivery.street;
    const city = "City : " + delivery.city;
    const postcode = "Postcode : " + delivery.postcode;
    const province = "Province : " + delivery.province;
    
    return (
      <Menu.Menu style={styles.container}>
          <Menu.Item style={styles.item}>
              {street}
          </Menu.Item>
          <Menu.Item style={styles.item}>
               {city}
          </Menu.Item>
          <Menu.Item style={styles.item}>
               {postcode}
          </Menu.Item>
          <Menu.Item style={styles.item}>
               {province}
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
  item: {
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: "1.0em",
    fontWeight: "normal",
    color: "black",
    opacity: 1.0,
  }
};

const mapStateToProps = state => {
  const reposData = state.user.reposData;
  const usertag = state.user.usertag;
  const clienttag = state.user.clienttag;
  let workOrders = null;
  //console.log(clienttag);
  if (clienttag) {
      //const clientContact = reposData["clients"]["data"][clienttag]["contact"];
      workOrders = reposData["clients"]["data"][clienttag]?
      reposData["clients"]["data"][clienttag]["workorders"] : null;
      //console.log(clientContact);
  }
  return {
     orders: workOrders,
     french: state.user.french
   }
};

export default connect(
  mapStateToProps,
  {}
)(Delivery);

//export default Delivery;
