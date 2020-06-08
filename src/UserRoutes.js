import React from "react";
import firebase from "./firebase";
import { Grid, Menu } from "semantic-ui-react";
import { connect } from "react-redux";
import User from "./User";
import Routes from "./Routes";
import Deliverys  from "./Deliverys";
import MapContainer from "./map/MapContainer";


class UserRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       routes: [],
       selectedRouteKey: null
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidMount() {
    const {wimdUser} = this.props;
    let userRoutes = [];
    if (wimdUser) { 
        const {userName} = wimdUser;
        firebase.database().ref("routes").on('value', snapshot => {
            const routes = snapshot.val();
            userRoutes.length = 0
            for (var key in routes) {
               if (userName === routes[key].userName) {              
                  userRoutes.push({...routes[key], routeKey: key})
                }
            }
            console.log ("UserRoutes firebase userRoutes.length : " + userRoutes.length)
            this.setState({routes: userRoutes});
            //this.props.setUserRoutes (userRoutes);
        });  
      }
  }

  setSelectedRouteKey(key) {
     //console.log("at UserRoutes setSelectedRouteKey");
     this.setState({selectedRouteKey: key});
  }

  render() {
    const {wimdUser} = this.props;
    const {routes, selectedRouteKey} = this.state;

    return (
      <Grid style={styles.container}>
          <Grid.Row style={styles.row}>
            <Grid.Column style={styles.left}>
                 <Menu
                   size="large"
                   floated
                   vertical
                   style={styles.user}
                 >
                   <User wimdUser={wimdUser}/>
                 </Menu>
                 <Menu
                   size="large"
                   floated
                   vertical
                   style={styles.routes}
                 >
                   <Routes routes={routes} wimdUser={wimdUser} 
                           selectedRouteKey ={selectedRouteKey}
                           setSelectedRouteKey={(key)=>this.setSelectedRouteKey(key)}/>
                 </Menu>
            </Grid.Column>
            <Grid.Column style={styles.middle}>
                 <Menu
                   size="large"
                   floated
                   vertical
                   style={styles.deliverys}
                 >
                   <Deliverys routes={routes} selectedRouteKey={selectedRouteKey}/>
                 </Menu>
            </Grid.Column>
            <Grid.Column style={styles.map}>                
                    <MapContainer routes={routes} selectedRouteKey ={selectedRouteKey}/>            
            </Grid.Column>
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
  row: {
    width: "100vw",
    height:"100vh",
    margin:"0px",
    padding:"0px"
  },
  left: {
    width: "25%",
    height:"100vh",
    margin:"0px",
    padding:"0px"
  },
  middle: {
    width: "25%",
    height:"100vh",
    margin:"0px",
    padding:"0px"
  },
  map: {
    width: "50%",
    height:"100vh",
    margin:"0px",
    padding:"3px"
  },
  user: {
    padding: "0px",
    margin: "0px", 
    width:"100%", 
    height: "20vh"
  },
  routes: {
    padding: "0px",
    margin: "0px", 
    width:"100%", 
    height: "80vh"
  },
  deliverys: {
    padding: "0px",
    margin: "0px", 
    width:"100%", 
    height: "100vh"
  }
};

const mapStateToProps = state => ({
     wimdUser: state.user.wimdUser
  });

export default connect(mapStateToProps, {})(UserRoutes);
