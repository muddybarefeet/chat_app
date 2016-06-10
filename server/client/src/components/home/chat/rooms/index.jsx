//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend
// TODO: unfriend button 
var friendActions = require('./../../../../actions/friendActions.js');
var friendsStore = require('./../../../../stores/friendsStore.js');
var messageActions = require('./../../../../actions/messageActions.js');
var messagesStore = require('./../../../../stores/messagesStore.js');

var Rooms = require('./chat.jsx');

var React = require('react');
var Link = require('react-router').Link;

var Friends = React.createClass({

  getInitialState: function () {
    return {
      showRooms: true,
      showRoom: false
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

    });
  },


  render: function () {

    var that = this;
    var rooms;
    var title;

    // if chat is false in state then dont show else do show
    if (this.state.rooms) {
      title = "Rooms";

    } else if (this.state.showRoom) {
      title = "This is 1 room!"; //change to being the name of the room
      // friends = this.state.friends.map(function(person, id) {
      //   if (person.unread) {
      //     return <li key={id} onClick={that.seeFriendMessages.bind(null,person.username)}><strong style={{cursor: "pointer",color:"red"}}>{person.username}</strong></li>;
      //   } else {
      //     return <li key={id} onClick={that.seeFriendMessages.bind(null,person.username)}>{person.username}</li>;
      //   }
      // });
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

module.exports = Rooms;

// component to show rooms and on click go the room and its message hitsory