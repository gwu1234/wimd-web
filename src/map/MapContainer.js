import React, { Component} from 'react';
import { GoogleApiWrapper, Marker } from 'google-maps-react';
import { connect } from "react-redux";
//import firebase from "../firebase";
import CurrentLocation from './Map';
import InfoWindowEx from './InfoWindowEx'
import blueDot from '../images/blueDot.png';
import {Button, Icon } from 'semantic-ui-react';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
       showingInfoWindow: false,
       showingGwindow: false,
       activeMarker: {},
       selectedPlace: {},
       selectedLatLng: {},
       selectedStreet: '',
       selectedCity: '',
       selectedProvince: '',
       selectedCountry: '',
       selectedPostcode: '',
       selectedLat: '',
       selectedLng: '',
       mouseoverPlace: {},
       mouseoverMarker: {},
       showingMouseoverWindow: false,
       currentLocation: {},
       markers: [],
       tracking: false
    }
  }

  componentDidMount() {
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          });
        });
      }
  }

  static getDerivedStateFromProps(props, prevState) {
    const { routes , selectedRouteKey, tracking, tracks} = props;
    console.log("MapContainer getDerivedStateFromProps: selectedRouteKey ")
    const markers = [];
    if (!tracking && routes && routes.length > 0 && selectedRouteKey) {
      console.log("mapping deliveryoes ")
      //console.log(selectedRouteKey);
      var i;
      for (i = 0; i < routes.length; i++) {
          if (routes[i].routeKey  === selectedRouteKey) {
              for (var key in routes[i].deliverys) {
                     markers.push ({  
                          ...routes[i].deliverys[key], 
                          pos : {lat: routes[i].deliverys[key].lat, 
                                 lng: routes[i].deliverys[key].lng}
                    })
              }
           }  
      }
      console.log(markers)
      return {markers: markers, tracking: false};
    }  else if (tracking && tracks && tracks.length > 0) {
        console.log("mapping tracks ")
        //console.log(tracks);
        for (i = 0; i < tracks.length; i++) {        
                markers.push ({  
                      ...tracks[i], 
                      pos : {lat: tracks[i].lat, 
                             lng: tracks[i].lng}
                })
        } 
      console.log(markers)
      return {markers: markers, tracking: true}; 
    }
  }

  onMarkerClick = (props, marker, e) =>{
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      selectedLatLng: marker.pos,
      showingGwindow: false,
      showingMouseoverWindow: false,
    });
  }

  onMouseoverMarker= (props, marker, e) =>{
    if (!this.state.showingMouseoverWindow) {
    this.setState({
      mouseoverPlace: props,
      mouseoverMarker: marker,
      showingMouseoverWindow: true,
    });
    }
  }

  onClose = () => {
    console.log("onClose()");
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
      });
    }
  };

  onGclose = () => {
    console.log("onGclose()");
    if (this.state.showingGwindow) {
      console.log("onGclose(): closing");
      this.setState({
        showingGwindow: false,
      });
    }
  };

  onMouseoutMarker =()=> {
    if (this.state.showingMouseoverWindow) {
      console.log("onMouseoutMarker: closing");
      this.setState({
        showingMouseoverWindow: false,
      });
    }
  }

  onMclose =()=> {
    if (this.state.showingMouseoverWindow) {
      this.setState({
        showingInfoWindow: false,
        showingGwindow: false,
        showingMouseoverWindow: false,
      });
    }
  }

  render() {
      let {selectedLat, selectedLng, currentLocation, markers, tracking} = this.state;
      let selectedLatLng = null;
      if (selectedLat && selectedLng ) {
           selectedLatLng = {lat: selectedLat, lng: selectedLng} ;
      }

      if (!selectedLatLng && currentLocation && currentLocation.lat && currentLocation.lng) {
           selectedLatLng = {lat: currentLocation.lat, lng: currentLocation.lng};
      }

      return (
      <CurrentLocation google={this.props.google} centerAroundCurrentLocation  >
      {markers && markers.map((marker, index)=> {

          const  image = blueDot;        
          return (
                 <Marker
                      key={index}
                      id = {index}
                      position={marker.pos}
                      name = {marker.name}
                      onClick={!tracking?this.onMarkerClick:null}
                      onMouseover={!tracking?this.onMouseoverMarker:null}
                      onMouseout = {!tracking?this.onMouseoutMarker:null}
                      key = {!tracking? marker.deliveryKey: marker.trackKey}
                      street={marker.street}
                      city={marker.city}
                      postcode={marker.postcode}
                      lat={marker.lat}
                      lng={marker.lng}
                      icon = {!tracking?{
                          url: image,
                          scaledSize: { width: 10, height: 10 }
                      }:{
                        url: image,
                        scaledSize: { width: 10, height: 10 }
                      }}
                  >
                 </Marker> )
          })}

          {this.state.selectedPlace && <InfoWindowEx
                 marker={this.state.activeMarker}
                 visible={this.state.showingInfoWindow}
                 onClose={this.onClose} >
                 <div style={styles.calloutContainer}>
                     <div>
                         <p style={styles.calloutName}>{this.state.selectedPlace.name}</p>
                         <p style={styles.calloutAddress}>
                            {this.state.selectedPlace.street} , &nbsp;
                            {this.state.selectedPlace.city} </p>
                     </div>
                     <div style={styles.calloutButtonContainer}>
                          <Button icon size="mini" color="green" onClick={this.onClose}>
                                    <Icon name='cancel' size ="large"/> Close
                          </Button>
                     </div>
                 </div>
          </InfoWindowEx> }

          {this.state.mouseoverPlace && <InfoWindowEx
                 marker={this.state.mouseoverMarker}
                 visible={this.state.showingMouseoverWindow}
                 onClose={this.onMclose} >
                 <div style={styles.mouseoverContainer}>
                     <div>
                         <p style={styles.calloutName}>{this.state.mouseoverPlace.name}</p>
                         <p style={styles.calloutAddress}>
                            {this.state.mouseoverPlace.street} </p>
                          <p style={styles.calloutAddress}>
                            {this.state.mouseoverPlace.city} </p>
                     </div>
                 </div>
          </InfoWindowEx> }
      </CurrentLocation>
     )
  }
}

const styles = {
  calloutName: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: "1.2em",
    color:'black',
    marginBottom: 0,
    marginTop: "2px",
    paddingTop: 0,
    paddingBottom: 0,
  },
  calloutAddress: {
    fontWeight: 'normal',
    textAlign: 'center',
    fontSize: "1.0em",
    color:'black',
    marginBottom: 0,
    marginTop: "3px",
    paddingTop: 0,
    paddingBottom: 0,
  },
  calloutButtonContainer: {
        marginTop: 5,
  },
  calloutContainer: {
      marginTop: "10px",
      width: "130px",
      height: "100px",
    },
  mouseoverContainer: {
      marginTop: "10px",
      width: "130px",
      height: "80px",
  }
};

const mapStateToProps = state => ({
});

const WrappedContainer = GoogleApiWrapper({
  apiKey: 'abc123456'
})(MapContainer);

export default connect(mapStateToProps,{})(WrappedContainer);

