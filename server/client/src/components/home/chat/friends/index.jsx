//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend
// TODO: unfriend button
var friendActions = require('./../../../../actions/friendActions.js');
var messageActions = require('./../../../../actions/messageActions.js');
var friendsStore = require('./../../../../stores/friendsStore.js');
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
    console.log('want to see chat History!', username);
    // on click here we want to go to a new page that is the chat history between the users
    // onclick need to go to new component and here to show the message history
    // redirect to messages page

    // set the state to show the chat component and from there trigger request to get all messages
    this.setState({
      chat:true,
      showFriends:false
    });

    this.render();

  },


  render: function () {

    var that = this;
    var Friends; 
    var Messages;
    var Title;

    // if chat is false in state then dont show else do show
    if (this.state.chat) {
      Title = "Chat";
      Messages = (<Chat></Chat>);
    } else if (this.state.showFriends) {
      Title = "Friends";
      Friends = this.state.friends.map(function(person, id) {
        return <li key={id} onClick={that.seeFriendMessages.bind(null,person.username)}>{person.username}</li>;
      });
    }

    return (
      <div>
        <div>
          <h1>{Title}</h1>
          <ul>  
            {Friends}
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Friends;

