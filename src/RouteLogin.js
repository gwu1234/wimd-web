import React from "react";
import firebase from "./firebase";
import { connect } from "react-redux";
import { setSelectedRoutekey } from "./actions";
import {Grid,Form,Segment,Header,Message,Icon, Button} from "semantic-ui-react";
import { Link } from "react-router-dom";

class RouteLogin extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
        errors: [],
        loading: false,
        deliveryId: "",
        routes: null,
        selectedRoute: null
     }
  }

  componentDidMount() {
    firebase.database().ref("routes").on('value', snapshot => {
        const routes = snapshot.val();
        this.setState({
          deliveryId: "", 
          routes: routes,
          errors:[]
        });  
    });   
  }

  componentWillUnmount() {
    firebase.database().ref("routes").off() ;
    this.setState({routes: null, deliveryId: ""}); 
  }

  isFormEmpty = () => {
    let errors = [];
    let error;
    const {deliveryId} = this.state;
    if (!deliveryId) {
       console.log("delivery id not exits")
       error = { message: "Fill in the field of Delivery ID" };
       this.setState({ errors: errors.concat(error) });
       return true;
    } 
    return false; 
  };

  isRouteExist = ({ deliveryId, routes }) => {
    let errors = [];
    let error;
    for (var key in routes) {
      if (routes[key].routeName === deliveryId ) {
          console.log("route found");
          console.log(routes[key]);
          this.setState ({
            selectedRoute: routes[key]
          })
          return routes[key];
      }
    }
    error = { message: "Delivery Id not found" };
    this.setState({ errors: errors.concat(error) });
    return null;
  };

  handleChange = event => {
    this.setState({ 
      [event.target.name]: event.target.value,
      errors:[] });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormEmpty()) {
          console.log("Submit Pressed");
          return;
     } 
     const selectedRoute = this.isRouteExist (this.state);
    
     if (!selectedRoute) {
          console.log("Submit Pressed");
          console.log("selectedRoute not found: ");
          return;
     } else {
          console.log("Submit Pressed");
          console.log("selectedRoute found: " + this.state.deliveryId);
          console.log (selectedRoute);
          this.props.setSelectedRoutekey (selectedRoute.routeKey);
          console.log (selectedRoute.routeKey);
          //console.log (this.state.selectedRoute);
          this.props.history.push("/map");
     }
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);


  render() {
    const {deliveryId, errors} =  this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" style={styles.container}>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center" style={{paddingBottom:"0px", marginBottom:"0px"}}>
            <Icon name="truck" color="orange" />
             WIMD
          </Header>
          <Header as="h4" icon color="orange" textAlign="center" style={{paddingTop:"0px", marginTop:"0px"}}>
             Where Is My Delivery ?
          </Header>
          
          <Form onSubmit={this.handleSubmit} size="large" style={{paddingBottom:"0px", marginBottom:"0px"}}>
            <Segment stacked>
              <Form.Input
                fluid
                name="deliveryId"
                icon="shipping fast"
                iconPosition="left"
                placeholder="Delivery ID"
                onChange={this.handleChange}
                value={deliveryId}
                type="text"
              />
              <Button
                disabled={false}
                color="violet"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message style={{paddingTop:"6px", marginTop:"0px"}}>
               Are you a seller ? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
const styles = {
  container: {
    height: "100vh",
    background: "#eee",
    padding: "0.0em",
    width:   "100%",
    background: "#eee",
    margin:  "2px",
  }
};

//export default RouteLogin;
const mapStateToProps = state => ({
});

export default connect(
 mapStateToProps, {setSelectedRoutekey}
)(RouteLogin);
