import React from "react";
import firebase from "./firebase";
import {Grid,Form,Segment,Button,Header,Message,Icon} from "semantic-ui-react";
import { Link } from "react-router-dom";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    mobile: "",
    errors: [],
    loading: false,
    wimdUser: null,
    userNames:[],
    registered: false,
    usersRef: firebase.database().ref("users")
  };

  componentDidMount() {
    firebase.database().ref("users").on('value', snapshot => {
        const wimdUser = snapshot.val(); 
        let userNames =[];
        for (var key in wimdUser) {
            if (typeof wimdUser[key].name !== 'undefined') {
                userNames.push(wimdUser[key].name);
            }
        }
        this.setState({wimdUser: wimdUser, userNames: userNames});  
    }) 
  };

  componentWillUnmount() {
    firebase.database().ref("users").off() ;
    this.setState({wimdUser: null}); 
  }

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    }
    else if (this.isUserExist(this.state)) {
      error = { message: "this user name existed already" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isMobileValid(this.state)) {
      error = { message: "mobile is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation, mobile }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length || 
      !mobile.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  isMobileValid = ({ mobile }) => {
    let regexp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i;
    if (mobile.length < 6 ) {
      return false;
    } else if (!regexp.test(mobile)) {
       console.log("not valid mobile number ");
       return false;
    } else {
      return true;
    }
  };

  isUserExist = ({ username, userNames }) => {
    if (userNames.includes(username)) {
          console.log( username + " existed already");
          return true;
    } else {
          return false;
    }
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
        this.setState({ errors: [], loading: true, registered: false});
        const { username, email, password, mobile, usersRef } = this.state;
        const userKey = usersRef.push().getKey();
        const newUser = {
           "name":  String(username),
           "password": String (password),
           "email": email,
           "mobile": String(mobile),
           "key": userKey
         }
        console.log(newUser);
        usersRef.child(userKey).set(newUser);
        this.setState({ 
            username: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            mobile: "",
            errors: [], 
            loading: false, 
            registered: true 
        });
    } else {
        this.setState({ errors: [], loading: false, registered: false });
    }
  };

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out!"));
  };


  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };


  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      mobile,
      errors,
      loading, 
      wimdUser
    } = this.state;

    console.log("register firebase wimd user : " );
    console.log(wimdUser);

    return (
      <React.Fragment>
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="truck" color="orange" />
            WIMD
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
                type="text"
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, "email")}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <Form.Input
                fluid
                name="mobile"
                icon="mobile"
                iconPosition="left"
                placeholder="mobile number"
                onChange={this.handleChange}
                value={mobile}
                className={this.handleInputError(errors, "mobile")}
                type="text"
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="orange"
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
          <Message>
            {this.state.registered? "Registered successfully " : "Already a user? " }  <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
      </React.Fragment>
    );
  }
}

export default Register;
