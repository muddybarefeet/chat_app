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

  addName: function (event) {
    this.setState({
      roomName: event.target.value
    });
  },

  addType: function (type) {
    console.log('this event is a radio', event);
    this.setState({
      roomStatus: type
    })
  },

  makeRoom: function () {
    console.log('this is a room being made', this.state.roomName, this.state.roomStatus);
    // roomActions.makeRoom(this.state.roomName, this.state.roomStatus);
  },

  render: function () {

    var that = this;
    var rooms;
    var title;

    // if chat is false in state then dont show else do show
    if (this.state.showRooms) {
      title = "Rooms";
      if (this.state.rooms) {
        rooms = this.state.rooms.map(function (room, id) {
          return (<li key={id}>{room.name}</li>);
        });
      }
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
          <i className="fa fa-plus fa-2x" aria-hidden="true" onClick={this.makeRoom}></i>
          <input type="name" className="form-control" id="name" placeholder="Room Name" onChange={this.addName}/>
          {/*<input type="name" className="form-control" id="username" placeholder="Invite User Type a Username" />*/}
          <div>
            <div className="radio">
              <label><input type="radio" name="optradio" onClick={this.addType.bind(null,"public")}/>Public</label>
            </div>
            <div className="radio">
              <label><input type="radio" name="optradio" onClick={this.addType.bind(null,"private")}/>Private</label>
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={this.makeRoom}>Create</button>

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