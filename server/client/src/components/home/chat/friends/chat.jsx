//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend

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
    messageActions.getMessages();
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
    });
  },

  sendMessgae: function (username) {
    console.log('sending message');

  },


  render: function () {

    var that = this;

    // var Messages = this.state.messages.map(function(message, id) {
    //   return <li key={id} onClick={that.seeFriendMessages.bind(null,message)}>{message}</li>;
    // });

    return (
      <div>
        <div>
          <ul>  
            <li>THINGS</li>
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Chat;

