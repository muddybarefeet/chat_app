//this is the index for the main page of the app! to be made ....
var friendActions = require('./../../../actions/friendActions.js');
var friendsStore = require('./../../../stores/friendsStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Friends = React.createClass({

  getInitialState() {
      return {
          friends: friendsStore.getFriendData().friends,
          notYetFriends: friendsStore.getFriendData().notYetFriends,
          pendingRequestIn: friendsStore.getFriendData().pendingRequestIn,
          pendingRequestOut: friendsStore.getFriendData().pendingRequestOut  
      };
  },

  componentDidMount: function () {
    friendsStore.addChangeListener(this._onChangeEvent);
  },

  componentWillUnmount: function () {
    friendsStore.removeChangeListener(this._onChangeEvent);
  },

  _onChangeEvent: function () {
    console.log('on change event in firends');
    // friends have been got and now they need to be displayed
    this.setState({
      friends: friendsStore.getFriendData().friends,
      notYetFriends: friendsStore.getFriendData().notYetFriends,
      pendingRequestIn: friendsStore.getFriendData().pendingRequestIn,
      pendingRequestOut: friendsStore.getFriendData().pendingRequestOut
    });
    this.render();
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
    // var details = [];
    // if (this.state.notYetFriends) {
    //   this.state.notYetFriends.map(function(person) {
    //     details.push(person.username);
    //   });
    // }

    return (
      <div>
        <div>
          <h3>Friends</h3>
          <ul>  
            {this.state.notYetFriends.map(function(person, id) {
                console.log('in map');
               return <li key={id} >{person.username}</li>;
            })}
          </ul>
        </div>
        {/*<div>
          <h3>Pending Requests To Me</h3>
          <ul>  
            {this.state.notYetFriends.map(function(person, id) {
                console.log('in map');
               return <li key={id} >{person.username}</li>;
            })}
          </ul>
        </div>
        <div>
          <h3>Pending Requests Sent Out</h3>
          <ul>  
            {this.state.notYetFriends.map(function(person, id) {
                console.log('in map');
               return <li key={id} >{person.username}</li>;
            })}
          </ul>
        </div>
        <div>
          <h3>Not Yet Friends</h3>
          <ul>  
            {this.state.notYetFriends.map(function(person, id) {
                console.log('in map');
               return <li key={id} >{person.username}</li>;
            })}
          </ul>
        </div>*/}
      </div>
    );
  }

});

module.exports = Friends;

