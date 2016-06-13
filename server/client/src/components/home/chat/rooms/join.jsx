

var roomActions = require('./../../../../actions/roomActions.js');
var roomStore = require('./../../../../stores/roomStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Join = React.createClass({

  getInitialState: function () {
    return {
      // trigger get all message function
      // toJoin: roomStore.getRoomData().toJoin
    };
  },

  componentWillMount: function () {

  },

  componentDidMount: function () {
    roomStore.addChangeListener(this._onChangeEvent);
  },

  componentWillUnmount: function () {
    roomStore.removeChangeListener(this._onChangeEvent);
  },

  _onChangeEvent: function () {
    // friends have been got and now they need to be displayed
    console.log('state changed');
    this.setState({
      messages: roomStore.getRoomData().messages
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
    var messages;

    // if (this.state.messages) {
    //   messages = this.state.messages.map(function(message, id) {
    //     // if the message has not been read then it needs to be highlighted
    //     if (message.has_been_read) {
    //       return <li key={id} style={{color:"red"}}><strong>{message.message}</strong></li>;
    //     } else if (!message.has_been_read) {
    //       return <li key={id}>{message.message}</li>;
    //     }
    //   });
    // }

    return (
      <div>
        <h2>Join a room</h2>
      </div>
    );
  }

});

module.exports = Join;

