//this is the index for the main page of the app! to be made ....
var friendActions = require('./../../../actions/friendActions.js');
var friendsStore = require('./../../../stores/friendsStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Friends = React.createClass({

  componentDidMount: function () {
    friendsStore.addChangeListener(this._onChangeEvent);
  },

  componentWillUnmount: function () {
    friendsStore.removeChangeListener(this._onChangeEvent);
  },

  _onChangeEvent: function () {
    console.log('on change event in firends');
    // window.location.hash="#/";
  },

  // handleAddFriendClick: function () {
  //   friendActions.addFriend('kate'); //hard coded in that I want to befriend dad currently to test!!
  // },

  // handleConfirmFriend: function () {
  //   friendActions.confirmRequest('anna');
  // },

  // handleNewFriendsClick: function () {
  //   friendActions.getFriends();
  // },


  render: function () {

    return (
      <div>
        <div>Friends</div>
        <div>Pending Requests To Me</div>
        <div>Pending Requests Sent Out</div>
      </div>
    );
  }

});

module.exports = Friends;

