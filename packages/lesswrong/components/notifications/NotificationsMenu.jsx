import { Components, registerComponent, withCurrentUser, withList, withEdit } from 'meteor/vulcan:core';
import Users from "meteor/vulcan:users";
import React, { Component } from 'react';

import Popover from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import {Tabs, Tab} from 'material-ui/Tabs';
import AllIcon from 'material-ui/svg-icons/social/notifications';
import UnreadIcon from 'material-ui/svg-icons/action/visibility-off';
import PostsIcon from 'material-ui/svg-icons/action/description';
import CommentsIcon from 'material-ui/svg-icons/editor/mode-comment';
import MessagesIcon from 'material-ui/svg-icons/communication/forum';

// import { NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';
import Notifications from '../../lib/collections/notifications/collection.js'


const tabLabelStyle = {
  color: "rgba(0,0,0,0.8)",
  fontFamily: "freight-sans-pro, sans-serif"
}

const iconStyle = {
  color: "rgba(0,0,0,0.8)",
}

class NotificationsMenu extends Component {
  render() {
      const currentUser = this.props.currentUser;
      if (!currentUser) {
        return null;
      } else {
        const AllNotificationTerms = {view: 'userNotifications', userId: currentUser._id};
        const PostsNotificationTerms = {view: 'userNotifications', userId: currentUser._id, type: "newPost"};
        const CommentsNotificationTerms = {view: 'userNotifications', userId: currentUser._id, type: "newComment"};
        const MessagesNotificationTerms = {view: 'userNotifications', userId: currentUser._id, type: "newMessage"};
        return (
          <div className="notifications-menu">
            <Drawer
              open={this.props.open}
              width={300}
              containerStyle={{top: "64px", zIndex: "1000", height: "100vh", boxShadow: "none"}}
              overlayStyle={{zIndex: "900", opacity: "0"}}
              openSecondary={true}
              onRequestChange={this.props.handleToggle}
            >
              <div className="notifications-menu-content">
                <Tabs>
                  <Tab icon={<AllIcon style={iconStyle}/>} style={tabLabelStyle}>
                    <Components.NotificationsList terms={AllNotificationTerms} />
                  </Tab>
                  <Tab icon={<PostsIcon style={iconStyle}/>} style={tabLabelStyle}>
                    <Components.NotificationsList terms={PostsNotificationTerms} />
                  </Tab>
                  <Tab icon={<CommentsIcon style={iconStyle} />} style={tabLabelStyle}>
                    <Components.NotificationsList terms={CommentsNotificationTerms} />
                  </Tab>
                  <Tab icon={<MessagesIcon style={iconStyle} />} style={tabLabelStyle}>
                    <Components.NotificationsList terms={MessagesNotificationTerms} />
                  </Tab>
                </Tabs>
              </div>
            </Drawer>
          </div>
        )
      }
  }
}

NotificationsMenu.propTypes = {
  color: PropTypes.string,
};

NotificationsMenu.defaultProps = {
  color: "rgba(0, 0, 0, 0.6)"
}

registerComponent('NotificationsMenu', NotificationsMenu, withCurrentUser);


{/* <div className="notifications-menu-top">
  <div className="notifications-menu-header">
    Notifications
  </div>
  <span className="notifications-menu-actions">
    {results && results.length ? <a className="notifications-menu-read-all" onTouchTap={() => this.viewNotifications(results)}>Mark All as Read</a> : null}
    <Link to={Users.getProfileUrl(currentUser) + "/edit"} className="notifications-menu-settings">Settings</Link>
  </span>
</div>

<Link to={{pathname: '/inbox', query: {select: "Notifications"}}} className="notifications-menu-inbox-button" onTouchTap={() => this.setState({open: false})}>
  <div className="notifications-menu-inbox-button-text">
    All Notifications
  </div>
</Link> */}
