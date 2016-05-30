//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend

var friendActions = require('./../../../actions/friendActions.js');
var friendsStore = require('./../../../stores/friendsStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Friends = React.createClass({

  getInitialState: function () {
    return {
      friends: friendsStore.getFriendData().friends
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
      friends: friendsStore.getFriendData().friends
    });
  },

  seeFriendMessages: function () {
    console.log('want to see chat History!');
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
        <h1>Friends</h1>
        <div>
          <h3>Friends</h3>
          <ul>  
            {this.state.friends.map(function(person, id) {
                console.log('in map');
               return <li key={id} onClick={this.seeFriendMessages} >{person.username}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Friends;

