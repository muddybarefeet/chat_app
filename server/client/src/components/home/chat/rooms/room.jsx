

var roomActions = require('./../../../../actions/roomActions.js');
var roomStore = require('./../../../../stores/roomStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Room = React.createClass({

  getInitialState: function () {
    return {
      // trigger get all message function
      messages: roomStore.getRoomData().messages
    };
  },

  componentWillMount: function () {
    // roomActions.getMessages(this.props.username);
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

  handleChange: function(event){
    // if the key was not enter then save the content of what is typed to the state
    this.setState({
      value: event.target.value
    });
  },

  sendRoomMessage: function () {
    if(event.key === 'Enter'){
      console.log('sending message', this.props.roomName, this.state.value);
      // roomActions.sendMessage(this.props.roomName,this.state.value);
      this.setState({
        value: ""
      });
    }
  },

  render: function () {

    var that = this;
    var messages;

    if (this.state.messages) {
      messages = this.state.messages.map(function(message, id) {
        // if the message has not been read then it needs to be highlighted
        if (message.has_been_read) {
          return <li key={id} style={{color:"red"}}><strong>{message.message}</strong></li>;
        } else if (!message.has_been_read) {
          return <li key={id}>{message.message}</li>;
        }
      });
    }

    return (
      <div>
        <div>
          <ul>
            {messages}
          </ul>
          <div className="width-input">
            <div className="input-group">
              <textArea type="text" className="form-control" placeholder="" value={this.state.value} onKeyUp={this.sendRoomMessage} onChange={this.handleChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Room;

