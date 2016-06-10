//this is the index for the main page of the app! to be made ....
var friendActions = require('./../../actions/friendActions.js');

var React = require('react');
var Link = require('react-router').Link;
var Friends = require('./chat/friends/index.jsx');
var Rooms = require('./chat/rooms/index.jsx');
var Add = require('./chat/addFriends.jsx');
var Pending = require('./chat/pendingFriends.jsx');

var Main = React.createClass({

  getInitialState: function() {
    return {
      toggle: false,
      friends: true,
      rooms : false,
      add: false,
      pending: false
    };
  },

  componentWillMount: function () {
    friendActions.getFriends();
  },

  handleChatClick: function () {
    this.setState({
      toggle: this.state.toggle ? false : true
    });

  },

  getFriends: function () {
    // send query to the back end to return all friends to the friends store
    this.setState({
      // set the state to update the view
      friends: true,
      rooms : false,
      add: false,
      pending: false
    });
    friendActions.getFriends();
  },

  addFriendsPage: function () {
    //gets all the data to do with who the user is friends with and who they are not friends with
    this.setState({
      // set the state to update the view
      friends: false,
      rooms : false,
      add: true,
      pending: false
    });
    friendActions.getFriends();
  },

  pendingPage: function () {
    // open page of pending friends requests
    this.setState({
      // set the state to update the view
      friends: false,
      rooms : false,
      add: false,
      pending: true
    });
    friendActions.getFriends();
  },

  getRooms: function () {
    this.setState({
      // set the state to update the view
      friends: false,
      rooms : true,
      add: false,
      pending: false
    });
  },

  render: function () {

    var friends = this.state.friends;
    var rooms = this.state.rooms;
    var add = this.state.add;
    var pending = this.state.pending;

    toShow = "";

    if (friends) {
      toShow = <Friends></Friends>
    }
    if (rooms) {
      toShow = <Rooms></Rooms>
    }
    if (add) {
      toShow = <Add></Add>
    }
    if (pending) {
      toShow = <Pending></Pending>
    }

    return (
      <div>
        <div className={"sidebar-wrapper " + (this.state.toggle ? 'slide' : '')}>
            <ul className="sidebar-nav row">
                <li className="col-md-3">
                  <button type="button" className="btn btn-default" onClick={this.getFriends}>Friends</button>
                </li>
                <li className="col-md-3">
                  <button type="button" className="btn btn-default" onClick={this.getRooms}>Rooms</button>
                </li>
                <li className="col-md-3">
                  <button type="button" className="btn btn-default" onClick={this.addFriendsPage}>Find New Friends</button>
                </li>
                <li className="col-md-3">
                  <button type="button" className="btn btn-default" onClick={this.pendingPage}>Pending</button>
                </li>
            </ul>
            <div id="chat-space-top">
              {toShow}
            </div>
        </div>

        <div classN="page-content-wrapper">
          <a className="btn btn-default chat-button" id="menu-toggle" onClick={this.handleChatClick}><i className="fa fa-comment-o fa-2x" aria-hidden="true"></i></a>
        </div>

      </div>
    );
  }

});

module.exports = Main;

