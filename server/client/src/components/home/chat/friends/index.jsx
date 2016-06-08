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
      // return an array of usernames that have sent the user messages that they have not seen
      unread: messagesStore.getMessageData().unreadMessages,
      chat: false,
      showFriends: true
    };
  },

  componentWillMount: function () {
    messageActions.getUnreadMessages();
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
      friends: friendsStore.getFriendData().friends,
      unread: messagesStore.getMessageData().unreadMessages
    });
  },

  seeFriendMessages: function (username) {
    console.log('want to see chat History!', username);
    // on click here we want to go to a new page that is the chat history between the users
    // onclick need to go to new component and here to show the message history
    // redirect to messages page

    // set the state to show the chat component and from there trigger request to get all messages
    this.setState({
      chat:true,
      showFriends:false,
      userChatWith: username
    });

    this.render();

  },


  render: function () {

    var that = this;
    var friends; 
    var messages;
    var title;

    // if chat is false in state then dont show else do show
    if (this.state.chat) {
      title = "Chat with "+ this.state.userChatWith;
      messages = (<Chat username={this.state.userChatWith}></Chat>);
      // Friends = null;
    } else if (this.state.showFriends) {
      title = "Friends";
      friends = this.state.friends.map(function(person, id) {
        return <li key={id} onClick={that.seeFriendMessages.bind(null,person.username)}>{person.username}</li>;
      });
      // Messages = null;
    }

    return (
      <div>
        <div className="container">
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

