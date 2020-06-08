import React, { Component } from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';

export default class DoneModal extends Component {
  state = {
    modalOpen: false,
  }

  handleOpen = (open) => this.setState({ modalOpen: open })

  handleClose() {this.handleOpen(false)}

  /*handleSubmit = () => {
    const event = this.nativeEvent;
    if (event) {
       event.preventDefault();
    }
  };*/

  render() {
    const {clientname} = this.props;
    const titleString = clientname + " :  " + "Work is Done ?";

    return (
      <Modal
        trigger={<Button icon size="mini" color="green" onClick={() => this.handleOpen(true)} style = {{position: "relative", float: "left"}}> <Icon name='check circle outline' size ="large"/> Done </Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='mini'
        style={{background: "#ccc"}}
      >
        <Header icon='check circle outline' content={titleString} style = {{fontSize: "1.2em", fondStyle: "bold", color:"black"}}/>
        <Modal.Content style = {{color:"white", background:"green", fontStyle:"bold", fontSize:"1.1em"}}>
             <span >click green check to conform, &nbsp; &nbsp; or red cross to cancel</span>
        </Modal.Content>
        <Modal.Actions>
        <Button color="red" size="large"
              onClick={() => this.handleOpen(false)}
              >
              <Icon name='cancel' color ="brown" size ="large"/>
              Cancel
        </Button>

          <Button color='green' size="large"
                onClick={() => {this.props.workIsDone(); this.handleClose()}}
                >
                <Icon name='check' color ="brown" size ="large"/>
                Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
