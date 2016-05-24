//this is the index for the main page of the app! to be made ....
var friendActions = require('./../../actions/friendActions.js');

var React = require('react');
var Link = require('react-router').Link;

var Chat = React.createClass({

  // handleAddFriendClick: function () {
  //   friendActions.addFriend('kate'); //hard coded in that I want to befriend dad currently to test!!
  // },

  // handleConfirmFriend: function () {
  //   friendActions.confirmRequest('anna');
  // },

  // handleGetFriendsClick: function () {
  //   friendActions.getFriends();
  // },

  // handleNewFriendsClick: function () {
  //   friendActions.getFriends();
  // },

  render: function () {

    return (
      <div>
        <h1>IAM</h1>
        // <ul className="sidebar-nav row">
            // <li className="sidebar-brand col-md-4">
            //   <button type="button" className="btn btn-default" onClick={this.getFriends}>Friends</button>
            // {/*here have component to display the friends*/}
            // </li>
            // <li className="sidebar-brand col-md-4">
            //   <button type="button" className="btn btn-default">Rooms</button>
            // </li>
            // <li className="sidebar-brand col-md-4">
            //   <button type="button" className="btn btn-default">Add</button>
            // </li>
        // </ul>
      </div>
    );
  }

});

module.exports = Chat;

