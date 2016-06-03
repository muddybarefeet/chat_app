//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend

// TODO: unfriend button

var friendActions = require('./../../../actions/friendActions.js');
var messageActions = require('./../../../actions/messageActions.js');
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
    // friends have been got and now they need to be displayed
    this.setState({
      friends: friendsStore.getFriendData().friends
    });
  },

  seeFriendMessages: function (username) {
    console.log('want to see chat History!', username);
    // on click here we want to go to a new page that is the chat history between the users
    messageActions.seeMessageHistory(username);

    // onclick need to go to new component and here to show the message history
    // redirect to messages page
  },


  render: function () {

    var that = this;

    var Friends = this.state.friends.map(function(person, id) {
      return <li key={id} onClick={that.seeFriendMessages.bind(null,person.username)}>{person.username}</li>;
    });

    return (
      <div>
        <div>
          <h1>Friends</h1>
          <ul>  
            {Friends}
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Friends;

