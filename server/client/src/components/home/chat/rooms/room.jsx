

var roomActions = require('./../../../../actions/roomActions.js');
var friendActions = require('./../../../../actions/friendActions.js');
var roomStore = require('./../../../../stores/roomStore.js');
var friendsStore = require('./../../../../stores/friendsStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Room = React.createClass({

  getInitialState: function () {
    return {
      // trigger get all message function
      messages: roomStore.getRoomData().messages,
      searchResults: friendsStore.getFriendData().possibleFriends,
      addUser: false
    };
  },

  componentWillMount: function () {
    roomActions.getMessages(this.props.roomName);
  },

  componentDidMount: function () {
    roomStore.addChangeListener(this._onChangeEvent);
    friendsStore.addChangeListener(this._onChangeEvent);
  },

  componentWillUnmount: function () {
    friendsStore.removeChangeListener(this._onChangeEvent);
  },

  _onChangeEvent: function () {
    // friends have been got and now they need to be displayed
    this.setState({
      messages: roomStore.getRoomData().messages,
      searchResults: friendsStore.getFriendData().possibleFriends
    });
  },

  handleChange: function(event){
    // if the key was not enter then save the content of what is typed to the state
    this.setState({
      value: event.target.value
    });
  },

  sendRoomMessage: function (event) {
    if(event.key === 'Enter'){
      roomActions.sendMessage(this.props.roomName,this.state.value);
      this.setState({
        value: ""
      });
    }
  },

  addUser: function () {
    // show an input bar and from this search for a friend to add
    this.setState({
      addUser: true
    });
  },

  throttle: function (fn, time) {
    console.log('throttle called');
    var working = false;
    var currentVal;
    return function () {

      if (working) {
        console.log('old val returned');
        return currentVal;
      }

      var args = Array.prototype.slice.call(arguments);

      working = true;

      setTimeout(function () {
        working = false;
      }, time);

      currentVal = fn.apply(null, args);
      console.log('new value returned');
      return currentVal;
    };
  },

  typingUsername: function (event) {
    console.log('typing');

    this.setState({
      search: event.target.value
    }, function () {
      var throttleFn = this.throttle(friendActions.search,1000);
      throttleFn(this.state.search);
    });

  },

  invite: function (username) {
    console.log('want to add the user clicked on', username);
  },

  render: function () {

    var that = this;
    var messages;
    var addUser;
    var searchResults;

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

    if (this.state.searchResults) {
      var that = this;
      searchResults = this.state.searchResults.map(function (user, id) {
        return <li key={id} onClick={that.invite.bind(null,user.username)}>{user.username}</li>;
      });
    }

    if (this.state.addUser) {
      addUser = (<input onChange={this.typingUsername} type="text" className="form-control" id="usr" placeholder="Username" />);
    }

    return (
      <div>
        <div>
          {addUser}
          <i className="fa fa-users" onClick={this.addUser}></i>
          <ul>
            {searchResults}
          </ul>
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

