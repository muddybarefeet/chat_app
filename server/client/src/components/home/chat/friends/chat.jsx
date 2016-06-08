//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend

// TODO make a button to go back to the friends page

var friendActions = require('./../../../../actions/friendActions.js');
var messageActions = require('./../../../../actions/messageActions.js');
var messagesStore = require('./../../../../stores/messagesStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Chat = React.createClass({

  getInitialState: function () {
    return {
      // trigger get all message function
      messages: messagesStore.getMessageData().messages
    };
  },

  componentWillMount: function () {
    messageActions.getMessages(this.props.username);
  },

  componentDidMount: function () {
    messagesStore.addChangeListener(this._onChangeEvent);
  },

  componentWillUnmount: function () {
    messagesStore.removeChangeListener(this._onChangeEvent);
  },

  _onChangeEvent: function () {
    // friends have been got and now they need to be displayed
    this.setState({
      // save the messages in the state
      messages: messagesStore.getMessageData().messages
    });
  },

  // TODO
  // if all of the messages are got, and some where not written by the user AND unread then highlight
  // on leaving this pannel then update the messages table to say that the messages have been seen


  handleChange: function(event){
    // if the key was not enter then save the content of what is typed to the state
    this.setState({
      value: event.target.value
    });
  },

  sendMessage: function (event) {
    if(event.key === 'Enter'){
      messageActions.sendMessage(this.props.username,this.state.value);
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
        return <li key={id}>{message.message}</li>;
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
              <textArea type="text" className="form-control" placeholder="" value={this.state.value} onKeyUp={this.sendMessage} onChange={this.handleChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Chat;

