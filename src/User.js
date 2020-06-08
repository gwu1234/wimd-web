import React from "react";
import { Menu, Icon, Header } from "semantic-ui-react";


class User extends React.Component {
  render() {
    const {wimdUser} = this.props;
    const {userKey, userName, userMobile, userEmail } = wimdUser? wimdUser: {};
    let titleString = "User Infomation ";
  
    return (
      <Menu.Menu style={styles.container} >
          <Menu.Header style={styles.menuHeader}>
                {titleString}
          </Menu.Header>
          <Menu.Item style={styles.menuItem}>
                {userName}
          </Menu.Item>
          <Menu.Item style={styles.menuItem}>
                {userMobile}
          </Menu.Item>
          <Menu.Item style={styles.menuItem}>
                {userEmail}
          </Menu.Item>
      </Menu.Menu>
    );
  }
}

const styles = {
  container: {
    margin: "2px",
    padding: "5px",
    paddingTop:"10px",
    height: "100%",
    background: "#f2f4f7",
  },
  menuHeader: {
    margin:"0px",
    padding:"5px",
    paddingTop:"5px",
    paddingLeft: "15px",
    textAlign: "center",
    color: "black",
    fontSize:"1.1em",
    fontWeight:"bold"
  },
  menuItem: {
    margin:"0px",
    padding:"5px",
    paddingTop:"5px",
    paddingLeft: "15px",
    color: "black",
    fontSize:"1.0em",
    fontWeight:"normal"
  }
};
export default User;

