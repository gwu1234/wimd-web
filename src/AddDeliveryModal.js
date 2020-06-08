import React, { Component } from 'react';
import firebase from "./firebase";
import { connect } from "react-redux";
import { Button, Header, Icon, Modal, Form, Grid} from 'semantic-ui-react';
//import DayPicker from 'react-day-picker';
//import 'react-day-picker/lib/style.css';

class AddDeliveryModal extends Component {
  state = {
    modalOpen: false,
    street: '',
    city: '',
    postcode:"",
    province:"",
    country:""
  }


  handleOpen = (open) => this.setState({ modalOpen: open })

  handleSubmit = () => {
    const event = this.nativeEvent;
    if (event) {
       //console.log(event);
       event.preventDefault();
    }

    if (this.isFormValid()) {
         const {street,city, postcode, province, country} = this.state;
         const {routeKey} = this.props;
         let deliveryPath = "routes/" +routeKey + "/deliverys/";
         const deliveryRef = firebase.database().ref(deliveryPath);
         const deliveryKey = deliveryRef.push().getKey();

         const newDelivery = {
             "street":  String(street),
             "city":  String(city),
             "province": String(province),
             "postcode": String(postcode),
             "deliveryKey": String(deliveryKey),
             "country": String(country),
         }
         //console.log(newDelivery);
         deliveryRef.child(deliveryKey).set(newDelivery);
         this.handleOpen(false);
    }
  };

  isFormValid() {
     const {street, city, postcode} = this.state;
     if ( !street) {
        window.alert ("street is required");
        return false;
     }
     if ( !city) {
        window.alert ("city is required");
        return false;
     }
     if ( !postcode) {
        window.alert ("postcode is required");
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
    let titleString = "Add Delivery";
    return (
      <Modal
        trigger={<Icon name='plus' size ="large" onClick={() => this.handleOpen(true)} style = {{position: "relative", float: "right", color:"black"}}/>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
        style={{background: "#ccc"}}
      >
        <Header icon='clipboard outline' content={titleString} style = {{fontSize: "1.0em", fondStyle: "bold", color:"black"}}/>
        <Modal.Content>
        <Grid style={{height: "100%", width:"100%"}}>
        
        <Form >
            <Form.Input size ="mini"
                        label='Street'
                         placeholder='street'
                         name="street"
                         onChange={this.handleChange} />
           
            <Form.Input size ="mini"
                         label='City'
                         placeholder='city'
                         name="city"
                         onChange={this.handleChange} />

            <Form.Input size ="mini"
                         label='Province'
                         placeholder='province'
                         name="province"
                         onChange={this.handleChange} />

            <Form.Input size ="mini"
                         label='Postcode'
                         placeholder='postcode'
                         name="postcode"
                         onChange={this.handleChange} />
            <Form.Input size ="mini"
                         label='Country'
                         placeholder='Country'
                         name="country"
                         onChange={this.handleChange} />
        </Form>
        </Grid>
        </Modal.Content>
        <Modal.Actions>
        <Button color="red" size="small" inverted
           onClick={() => {
              this.handleOpen(false);
              this.setState ({
                  date: '',
                  work: '',
                  deliveryId:"",
                })}}
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

const mapStateToProps = state => ({
      //routeKey: state.user.routeKey
   });

export default connect(
  mapStateToProps,
  {}
)(AddDeliveryModal);
