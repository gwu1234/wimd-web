import React from "react";
//import firebase from "./firebase";
import {Grid,Form,Segment,Header,Message,Icon, Button} from "semantic-ui-react";
//import { Link } from "react-router-dom";
import { connect } from "react-redux";

class WebError extends React.Component {
  state = {
    //error: "server is down"    
  };

  render() {
    const {serverError} = this.props;
    //console.log("server error :")
    //console.log (this.props.serverError)

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
          <Message content
             header= {serverError? serverError.subject: "server down"}
             content= {serverError? serverError.content: "server is down"}     
             style={{paddingTop:"6px", marginTop:"4px", color: "red", fontWeight: "bold"}}
        />
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
   serverError: state.user.serverError,
});

export default connect(
  mapStateToProps,
  {}
)(WebError);
