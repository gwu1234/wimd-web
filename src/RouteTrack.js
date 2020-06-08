import React from "react";
import firebase from "./firebase";
import { Grid, Menu } from "semantic-ui-react";
import { connect } from "react-redux";
import MapContainer from "./map/MapContainer";


class RouteTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       selectedRoute: null,
       selectedRouteKey: null, 
       tracks:[]
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidMount() {
    const {selectedRouteKey} = this.props;
    console.log(selectedRouteKey)
    const tracks = [];
    if (selectedRouteKey) { 
        firebase.database().ref("routes").child(selectedRouteKey).on('value', snapshot => {
            const route = snapshot.val();
            console.log ("firebase selectedRoute : ")
            console.log (route);
            tracks.length = 0
            for (var key in route.tracks) {            
                tracks.push({...route.tracks[key], trackKey: key})
            }
            console.log ("tracks.length : " + tracks.length)
            //console.log(tracks);
            this.setState({selectedRoute: route, selectedRouteKey: selectedRouteKey, tracks: tracks});
        });  
      }
  }

  componentWillUnmount() {
    const {selectedRouteKey} = this.props;
    if (selectedRouteKey) { 
        firebase.database().ref("routes").child(selectedRouteKey).off() ;
        this.setState({selectedRoute: null, selectedRouteKey: null});
    } 
  }

  render() {
    const {selectedRoute, tracks} = this.state;

    let nameLabel= "";
    nameLabel = selectedRoute? "Route Name : " + selectedRoute.routeName : "";
    return (
      <Grid style={styles.container}>
        <Grid.Row style={styles.route}>                     
              {nameLabel}                  
        </Grid.Row>
        <Grid.Row style={styles.map}>                     
              <MapContainer tracks={tracks} tracking ={true}/>                    
        </Grid.Row>
      </Grid>
    );
  }
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    padding: "0.0em"
  },
  route: {
    width: "100%",
    height:"5vh",
    margin:"0px",
    padding:"20px"
  },
  map: {
    width: "100%",
    height:"95vh",
    margin:"0px",
    padding:"3px"
  },
};

const mapStateToProps = state => {
  console.log (state.user.selectedRouteKey);
  return (
    {
     selectedRouteKey: state.user.selectedRouteKey
    })
};

export default connect(mapStateToProps, {})(RouteTrack);
