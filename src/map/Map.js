import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
};
export class CurrentLocation extends React.Component {
  constructor(props) {
    super(props);

    const { lat, lng } = this.props.initialCenter;
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    };
  }
  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
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
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  handleEvent(event, eventName) {
    let timeout;

    let handlerName = eventName;
    if (eventName ==="click") {
         handlerName = "onClick";
    }
    //console.log(eventName);
    //console.log(event.latLng.lat());
    //console.log(event.latLng.lng());
    //console.log(event.pa.x);
    //console.log(event.pa.y);

    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    //timeout = setTimeout(() => this.props.clickOnMap(event.latLng, event.pa), 0);
    /*timeout = setTimeout(() => {
       const { google } = this.props;
       const maps = google.maps;
       var geocoder = new google.maps.Geocoder;
       var infowindow = new google.maps.InfoWindow;
       this.geocodeLatLng(geocoder, infowindow, event.latLng);
    });*/
  }

  /*geocodeLatLng = (geocoder, infowindow, latLng) => {
        //const { google } = this.props;
        const map = this.map;
        //const current = this.state.currentLocation;

        const google = this.props.google;
        const maps = google.maps;
        //var input = document.getElementById('latlng').value;
        //var latlngStr = input.split(',', 2);
        //var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        geocoder.geocode({'location': latLng}, (results, status) =>{
          if (status === 'OK') {
            if (results[0]) {
              console.log(results[0].formatted_address);
              //map.setZoom(11);
              //var marker = new maps.Marker({
              //  position: latLng,
              //  map: map
              //});
              infowindow.setContent(results[0].formatted_address);
              infowindow.setPosition(latLng);
              infowindow.open(map);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }*/

  loadMap() {
    if (this.props && this.props.google) {
      // checks if google is available
      const { google } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;

      // reference to the actual DOM element
      const node = ReactDOM.findDOMNode(mapRef);

      let { zoom } = this.props;
      const { lat, lng } = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      );
      // maps.Map() is constructor that instantiates the map
      this.map = new maps.Map(node, mapConfig);

      const eventNames = ['click', 'dblclick'];
      eventNames.forEach(eventName => {
        this.map.addListener(eventName, (event)=>{this.handleEvent(event, eventName)});
      });
    }
  }

  recenterMap() {
    const map = this.map;
    const current = this.state.currentLocation;

    const google = this.props.google;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(current.lat, current.lng);
      map.panTo(center);
    }
  }

  renderChildren() {
    const { children } = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      if (!c) return;
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    });
  }

  render() {
    const style = Object.assign({}, mapStyles.map);

    return (
      <div>
        <div style={style} ref="map">
          Loading map...
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}
export default CurrentLocation;

CurrentLocation.propTypes = {
  onMove: PropTypes.func
}

CurrentLocation.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: -1.2884,
    lng: 36.8233
  },
  centerAroundCurrentLocation: false,
  visible: true,
};
