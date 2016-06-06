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

  handleChange: function(event){
    // if the key was not enter then save the content of what is typed to the state
    this.setState({
      value: event.target.value
    }, function () {console.log(this.state.value)});
  },

  sendMessage: function (event) {
    if(event.key === 'Enter'){
      console.log('in enter', this.state.value);
    }
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
            {}
          </ul>
          <div className="width-input">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="" value={this.state.value} onKeyUp={this.sendMessage} onChange={this.handleChange} />
              <span className="input-group-btn">
                <button className="btn btn-default" type="button">Go!</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Chat;

