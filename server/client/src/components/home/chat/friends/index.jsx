//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend
// TODO: unfriend button 
var friendActions = require('./../../../../actions/friendActions.js');
var friendsStore = require('./../../../../stores/friendsStore.js');
var messageActions = require('./../../../../actions/messageActions.js');
var messagesStore = require('./../../../../stores/messagesStore.js');

var Chat = require('./chat.jsx');

var React = require('react');
var Link = require('react-router').Link;

var Friends = React.createClass({

  getInitialState: function () {
    return {
      friends: friendsStore.getFriendData().friends,
      chat: false,
      showFriends: true
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
    // set the state to show the chat component and from there trigger request to get all messages
    this.setState({
      chat:true,
      showFriends:false,
      userChatWith: username
    });
  },

  returnToMain: function () {
    this.setState({
      chat: false,
      showFriends: true
    });
  },

  render: function () {

    var that = this;
    var friends; 
    var messages;
    var title;
    var backarrow;

    // if chat is false in state then dont show else do show
    if (this.state.chat) {
      title = "Chat with "+ this.state.userChatWith;
      messages = (<Chat username={this.state.userChatWith}></Chat>);
      backarrow = (<i className="fa fa-arrow-left fa-lg" aria-hidden="true" onClick={this.returnToMain}></i>);
    } else if (this.state.showFriends) {
      title = "Friends";
      friends = this.state.friends.map(function(person, id) {
        if (person.unread) {
          return <li key={id} onClick={that.seeFriendMessages.bind(null,person.username)}><strong style={{cursor: "pointer",color:"red"}}>{person.username}</strong></li>;
        } else {
          return <li key={id} onClick={that.seeFriendMessages.bind(null,person.username)}>{person.username}</li>;
        }
      });
    }

    return (
      <div>
        <div className="container">
          {backarrow}
          <h1>{title}</h1>
          <ul>  
            {friends}
            {messages}
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Friends;

