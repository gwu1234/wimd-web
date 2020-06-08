import React from "react";
import firebase from "./firebase";
import { connect } from "react-redux";
import {  setWimdUser } from "./actions";
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

class Login extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         userName: "",
         password: "",
         errors: [],
         loading: false, 
         wimdUser: null,
         userKey: null,
         logged: false
    }
  }
 
  componentDidMount() {
    firebase.database().ref("users").on('value', snapshot => {
        const wimdUser = snapshot.val();
        this.setState({
          userName: "",
          password: "", 
          wimdUser: wimdUser
        });  
    });   
  }

  componentWillUnmount() {
    firebase.database().ref("users").off() ;
    this.setState({wimdUser: null}); 
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid (this.state)) {
      error = { message: "password too short" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ userName, password }) => {
    return (
      !userName.length ||
      !password.length 
    );
  };

  isPasswordValid = ({ password }) => {
    if (password.length < 6 ) {
      return false;
    } else {
      return true;
    }
  };

  isUserExist = ({ userName, password, wimdUser }) => {
    for (var key in wimdUser) {
      if (wimdUser[key].name === userName && wimdUser[key].password === password) {
          this.setState({ userKey: key});
          this.props.setWimdUser ({
             userKey: key,
             userName: userName,
             userMobile: wimdUser[key].mobile,
             userEmail:  wimdUser[key].email          
          })
          return true;
      }
    }
    return false;
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
       if (this.isUserExist (this.state) ){
           console.log("logged successfully")
           console.log(this.state);
           this.setState({ logged: true });
           this.props.history.push("/routes");
        } else {
           console.log("login failed");
       }
    } 
    else {
       this.setState({ errors: [], loading: false , logged: false});
    }
  };

  render() {    
    const { userName, password, errors, loading, wimdUser, logged} = this.state;
    console.log("login firebase wimd user : " );
    console.log(wimdUser);
   
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
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="userName"
                icon="user"
                iconPosition="left"
                placeholder="User Name"
                onChange={this.handleChange}
                value={userName}
                type="text"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                type="password"
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
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
          {logged && <Message style={{color:"green", fontSize:"1.1em", fontStyle:"bold"}}>
              login successfully
          </Message>}
          <Message>
            Do not have an account? <Link to="/register">Register</Link>
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

const mapStateToProps = state => ({
 });

export default connect(
  mapStateToProps,
  {setWimdUser}
)(Login);
