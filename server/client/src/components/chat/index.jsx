//this is the index for the main page of the app! to be made ....
var friendActions = require('./../../actions/friendActions.js');

var React = require('react');
var Link = require('react-router').Link;

var Chat = React.createClass({

  handleAddFriendClick: function () {
    friendActions.addFriend('dad'); //hard coded in that I want to befriend dad currently to test!!
  },

  handleConfirmFriend: function () {
    friendActions.confirmRequest('anna'); //
  },

  handleGetFriendsClick: function () {
    friendActions.getFriends();
  },

  handleNewFriendsClick: function () {
    friendActions.getFriends();
  },

  render: function () {

    return (
      <div>

        <h1>Chat Page</h1>
        <div className="container">
          <input type="text" className="form-control" id="messageBox" />
        </div>
        <button type="button" className="btn btn-warning" onClick={this.handleAddFriendClick}>Add friend</button>
        <button type="button" className="btn btn-default" onClick={this.handleConfirmFriend}>Confirm Friend</button>
        <button type="button" className="btn btn-info" onClick={this.handleGetFriendsClick}>See Friends</button>
        <button type="button" className="btn btn-success" onClick={this.handleNewFriendsClick}>See new Friends</button>

        <div id="messageHistory"></div>

      </div>
    );
  }

});

module.exports = Chat;
