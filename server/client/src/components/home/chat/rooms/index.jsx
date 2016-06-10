//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend
// TODO: unfriend button 
var roomActions = require('./../../../../actions/roomActions.js');
var roomStore = require('./../../../../stores/roomStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Rooms = React.createClass({

  getInitialState: function () {
    return {
      showRooms: true,
      showChatRoom: false,
      rooms: roomActions.getRooms()
    };
  },

  componentDidMount: function () {
    roomStore.addChangeListener(this._onChangeEvent);
  },

  componentWillUnmount: function () {
    roomStore.removeChangeListener(this._onChangeEvent);
  },

  _onChangeEvent: function () {
    // friends have been got and now they need to be displayed
    this.setState({
      rooms: roomStore.getRoomData().rooms
    });
  },

  render: function () {

    var that = this;
    var rooms = null;
    var title;

    // if chat is false in state then dont show else do show
    if (this.state.showRooms) {
      title = "Rooms";

    } else if (this.state.showChatRoom) {
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
            {rooms}
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Rooms;

// component to show rooms and on click go the room and its message hitsory