import React, { Component } from 'react';
import firebase from "./firebase";
//import Geocode from "react-geocode";
import { Button, Header, Icon, Modal, Form} from 'semantic-ui-react';

//const JOB_NEW = 0;
//const JOB_REPEAT = 1;
//const JOB_DONE = 2;

export default class AddRouteModal extends Component {
  state = {
    modalOpen: false,
    routeName: '',
    routeKey: '',
    routePassword:'',
    userName: '',
    userKey: '',
    explanation:''
  }

  handleOpen = (open) => this.setState({ modalOpen: open })

  handleSubmit = () => {
    const event = this.nativeEvent;
    if (event) {
       event.preventDefault();
    }
    const {wimdUser} = this.props;
    const {routeName, routePassword, explanation} = this.state;
    if (this.isFormValid(this.state)) {
         const routesRef = firebase.database().ref("routes");  
         const routeKey = routesRef.push().getKey();
         const newRoute = {
           "routeName":  String(routeName),
           "routePassword": String (routePassword),
           "explanation": String(explanation),
           "routeKey": routeKey,
           "userName": wimdUser.userName,
           "userKey": wimdUser.userKey
         }
         routesRef.child(routeKey).set(newRoute);
         this.handleOpen(false);
    }
  };

  isFormValid({routeName, routePassword, explanation}) {
    //const {routeName, routePassword, explanation} = this.state;
    if (!routeName  ){
          window.alert("route name is required");
          return false;
    } 
    if (!routePassword ){
          window.alert("route password is required");
          return false;
    } 
    if (!explanation){
          window.alert("explanation is required");
          return false;
    } 
    return true;
  }

  handleChange = event => {
    //console.log([event.target.name]);
    //console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {wimdUser} = this.props;
    const titleString = wimdUser? wimdUser.userName + ":  Add New Route" : "Add New Route";
   
    return (
      <Modal
        trigger={<Icon name='plus' size ="small" onClick={() => this.handleOpen(true)} style={{marginLeft: "15px"}}/>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
        style={{background: "#ccc"}}
      >
        <Header icon='add user' content={titleString} style = {{fontSize: "1.0em", fondStyle: "bold", color:"black"}}/>
        <Modal.Content>
        <Form >
           <Form.Group inline width='equal' >
               <Form.Input size ="mini"
                           label='Route Name'
                           placeholder='Route Name'
                           name="routeName"
                           onChange={this.handleChange} />
                <Form.Input size ="mini"
                            label='Route Password'
                            placeholder='Route Password'
                            name="routePassword"
                            onChange={this.handleChange} />
                <Form.Input size ="mini"
                            label='Explanation'
                            placeholder='Explanation'
                            name="explanation"
                            onChange={this.handleChange} />
           </Form.Group>
        </Form>
        </Modal.Content>
        <Modal.Actions>
        <Button color="red" size="small" inverted
              onClick={() => this.handleOpen(false)}
              >
              Cancel
        </Button>

          <Button color='green' size="small" inverted
                onClick={() =>this.handleSubmit()}
                >
                Submit
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
