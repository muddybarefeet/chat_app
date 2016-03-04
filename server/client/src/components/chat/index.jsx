//this is the index for the main page of the app! to be made ....
var friendActions = require('./../../actions/friendActions.js');

var React = require('react');
var Link = require('react-router').Link;

var Chat = React.createClass({

  handleAddFriendClick: function () {
    //actions.showWhoCanFriend()
    friendActions.addFriend(4); //hard coded in that I want to befriend mum currently to test!!
  },

  handleSeeFriendsClick: function () {
    //actions.getFriends()
    friendActions.getFriends();
  },

  handleNewFriendsClick: function () {
    //actions.showWhoCanFriend()
    friendActions.getFriends();
  },

  render: function () {

    return (
      <div>

        <h1>Chat Page</h1>
        <button type="button" className="btn btn-warning" onClick={this.handleAddFriendClick}>Add friend</button>
        <button type="button" className="btn btn-info" onClick={this.handleSeeFriendsClick}>See Friends</button>
        <button type="button" className="btn btn-success" onClick={this.handleNewFriendsClick}>See new Friends</button>

      </div>
    );
  }

});

module.exports = Chat;
