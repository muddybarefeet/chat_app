//page to get the users friends and display them on the page
// on clicking on a friend a user can chat to that one friend

var friendActions = require('./../../../actions/friendActions.js');
var friendsStore = require('./../../../stores/friendsStore.js');

var React = require('react');
var Link = require('react-router').Link;

var Pending = React.createClass({

  getInitialState: function () {
    return {
      pendingRequestIn: friendsStore.getFriendData().pendingRequestIn,
      pendingRequestOut: friendsStore.getFriendData().pendingRequestOut
    };
  },

  componentDidMount: function () {
    friendsStore.addChangeListener(this._onChangeEvent);
  },

  componentWillUnmount: function () {
    friendsStore.removeChangeListener(this._onChangeEvent);
  },

  _onChangeEvent: function () {
    // friends have been got and now they need to be displayed
    this.setState({
      pendingRequestIn: friendsStore.getFriendData().pendingRequestIn,
      pendingRequestOut: friendsStore.getFriendData().pendingRequestOut
    });
  },

  acceptAdd: function (username) {
    console.log('add friend', username);
    // send the datd to the store and then round to the list item and the confirm/get parent value here?
    friendActions.confirmRequest(username);
    this.render();
  },

  rejectAdd: function (username) {
    console.log('reject friend', username);
    // test route for this on the back end!
    // TEST THIS ROUTE ON THE BACKEND FIRST
    // friendActions.rejectRequest(username);
    this.render();
  },

  render: function () {
    console.log('this STATE', this.state);
    var that = this;

    var pendingIn = this.state.pendingRequestIn.map(function(person, id) {
        return (
          <li key={id}>{person.username}
            <span onClick={that.acceptAdd.bind(null,person.username)}>
              <i className="fa fa-check" aria-hidden="true"></i>
            </span>
            <span onClick={that.rejectAdd.bind(null,person.username)}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </span>
          </li>
        );
    });

    var pendingOut = this.state.pendingRequestOut.map(function(person, id) {
      return (
        <li key={id}>{person.username}</li>
      );
    });

    return (
      <div>
        <h1>Pending Requests</h1>
        <div>
          <h3>Pending Friends Requests to Me</h3>
          <ul>  
            {pendingIn}
          </ul>
        </div>
        <div>
          <h3>Pending Friends Requests I Have Made</h3>
          <ul>  
            {pendingOut}
          </ul>
        </div>
      </div>
    );
  }

});

module.exports = Pending;

