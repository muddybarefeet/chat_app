//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend

var friendActions = require('./../../../actions/friendActions.js');
var friendsStore = require('./../../../stores/friendsStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Add = React.createClass({

  getInitialState: function () {
    return {
      notYetFriends: friendsStore.getFriendData().notYetFriends
    };
  },

  addFriend: function (id) {
    // get the username from the add friend request and then sent to actions
    console.log(id.target.attributes)
    // friendActions.addFriend();
  },

  componentDidMount: function () {
    friendsStore.addChangeListener(this._onChangeEvent);
  },

  componentWillUnmount: function () {
    friendsStore.removeChangeListener(this._onChangeEvent);
  },

  _onChangeEvent: function () {
    console.log('adding friends update')
    // friends have been got and now they need to be displayed
    this.setState({
      notYetFriends: friendsStore.getFriendData().notYetFriends
    });
  },

  seeFriendMessages: function () {
    console.log('want to see chat History!');
  },

  render: function () {
    var that = this;
    var ListItems = this.state.notYetFriends.map(function(person, id) {

        return (
          <div>
            <li key={id} onClick={that.addFriend}>{person.username}</li>
          </div>
        )

    });

    return (
      <div>
        <div>
          <h1>Add a New Friend</h1>
          <ul>  
            {ListItems}
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Add;

