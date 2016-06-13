

var roomActions = require('./../../../../actions/roomActions.js');
var roomStore = require('./../../../../stores/roomStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Join = React.createClass({

  getInitialState: function () {
    return {
      // trigger get all message function
      joinable: roomStore.getRoomData().joinable
    };
  },

  componentWillMount: function () {
    roomActions.getJoinable();
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
      joinable: roomStore.getRoomData().joinable
    });
  },

  // handleChange: function(event){
  //   console.log('writing message');
  //   // if the key was not enter then save the content of what is typed to the state
  //   this.setState({
  //     value: event.target.value
  //   });
  // },

  // sendRoomMessage: function (event) {
  //   if(event.key === 'Enter'){
  //     console.log('sending message', this.props.roomName, this.state.value);
  //     roomActions.sendMessage(this.props.roomName,this.state.value);
  //     this.setState({
  //       value: ""
  //     });
  //   }
  // },

  render: function () {

    var that = this;
    var toJoin;

    if (this.state.joinable) {
      toJoin = this.state.joinable.map(function(room, id) {
        return (<li key={id}>{room.name}</li>);
      });
    }

    return (
      <div>
        <h2>Join a room</h2>
        <ul>
          {toJoin}
        </ul>
      </div>
    );
  }

});

module.exports = Join;

