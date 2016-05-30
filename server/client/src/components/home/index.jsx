//this is the index for the main page of the app! to be made ....
var friendActions = require('./../../actions/friendActions.js');

var React = require('react');
var Link = require('react-router').Link;
var Friends = require('./chat/friends.jsx');
var Rooms = require('./chat/rooms.jsx');
var Add = require('./chat/addFriends.jsx');

var Main = React.createClass({

  getInitialState: function() {
    return {
      toggle: false,
      friends: true,
      rooms : false,
      add: false
    };
  },

  handleChatClick: function () {
    console.log('clicked!');
    this.setState({
      toggle: this.state.toggle ? false : true
    });

  },

  getFriends: function () {
    // send query to the back end to return all friends to the friends store
    friendActions.getFriends();
  },

  addFriendsPage: function () {
    //gets all the data to do with who the user is friends with and who they are not friends with
    this.setState({
      // set the state to update the view
      friends: false,
      rooms : false,
      add: true
    });
    friendActions.getFriends();
  },

  render: function () {

    var friends = this.state.friends;
    var rooms = this.state.rooms;
    var add = this.state.add;

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

    return (
      <div>
        <div className={"sidebar-wrapper " + (this.state.toggle ? 'slide' : '')}>
            <ul className="sidebar-nav row">
                <li className="col-md-4">
                  <button type="button" className="btn btn-default" onClick={this.getFriends}>Friends</button>
                </li>
                <li className="col-md-4">
                  <button type="button" className="btn btn-default">Rooms</button>
                </li>
                <li className="col-md-4">
                  <button type="button" className="btn btn-default" onClick={this.addFriendsPage}>Find New Friends</button>
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

