//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend
// TODO: unfriend button 
var roomActions = require('./../../../../actions/roomActions.js');
var roomStore = require('./../../../../stores/roomStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Room = require('./room.jsx');
var Join = require('./join.jsx');

var Rooms = React.createClass({

  getInitialState: function () {
    return {
      showRooms: true,
      showChatRoom: false,
      rooms: roomActions.getRooms(),
      currentRoom: null,
      join: false,
      create: false
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
    this.setState({
      roomStatus: type
    })
  },

  makeRoom: function () {
    roomActions.makeRoom(this.state.roomName, this.state.roomStatus);
  },

  seeRoom: function (name) {
    this.setState({
      showChatRoom: true,
      showRooms: false,
      join: false,
      currentRoom: name
    });
  },

  add: function () {
    this.setState({
      create: !this.state.create
    });
  },

  returnToMain: function () {
    this.setState({
      showRooms: true,
      join: false,
      showChatRoom: false
    });
  },

  joinRoomPage: function () {
    this.setState({
      showRooms: false,
      join: true,
      showChatRoom: false
    });
  },

  render: function () {

    var that = this;
    var rooms;
    var title;
    var room;
    var create;
    var backarrow;
    var join;

    // if chat is false in state then dont show else do show
    if (this.state.showRooms) {
      title = "Rooms";
      if (this.state.rooms) {
        rooms = this.state.rooms.map(function (room, id) {
          return (<li key={id} onClick={that.seeRoom.bind(null,room.name)}>{room.name}</li>);
        });
      }
    } else if (this.state.showChatRoom) {
      title = this.state.currentRoom; //change to being the name of the room
      room = (<Room roomName={this.state.currentRoom}></Room>);
      backarrow = (<i className="fa fa-arrow-left fa-lg" aria-hidden="true" onClick={this.returnToMain}></i>);
    } else if (this.state.join) {
      // show the pannel to join a room
      backarrow = (<i className="fa fa-arrow-left fa-lg" aria-hidden="true" onClick={this.returnToMain}></i>);
      join = (<Join></Join>);
    }

    if (this.state.create) {
      create = (
        <div>
          <input type="name" className="form-control" id="name" placeholder="Room Name" onChange={this.addName}/>
          <div className="radio">
            <label><input type="radio" name="optradio" onClick={this.addType.bind(null,"public")}/>Public</label>
          </div>
          <div className="radio">
            <label><input type="radio" name="optradio" onClick={this.addType.bind(null,"private")}/>Private</label>
          </div>
        <button type="button" className="btn btn-primary" onClick={this.add}>Create</button>
        </div>
      );
    }

    return (
      <div>
        <div className="container">
          {backarrow}
          <i className="fa fa-hand-o-right" aria-hidden="true" onClick={this.joinRoomPage}></i>
          <h1>{title}</h1>
          <i className="fa fa-plus fa-2x" aria-hidden="true" onClick={this.add}></i>
          {create}
          {/*<input type="name" className="form-control" id="username" placeholder="Invite User Type a Username" />*/}
          <ul>
            {room} 
            {rooms}
            {join}
          </ul>

        </div>
      </div>
    );
  }

});

module.exports = Rooms;

// component to show rooms and on click go the room and its message hitsory