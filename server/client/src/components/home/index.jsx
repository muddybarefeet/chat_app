//this is the index for the main page of the app! to be made ....
var friendActions = require('./../../actions/friendActions.js');

var React = require('react');
var Link = require('react-router').Link;
var Friends = require('./chat/friends.jsx');
var Rooms = require('./chat/rooms.jsx');
var Add = require('./chat/add.jsx');

var Main = React.createClass({

  getInitialState: function() {
    return {
      toggle: false
    };
  },

  handleChatClick: function () {
    console.log('clicked!');
    this.setState({
      toggle: this.state.toggle ? false : true
    });

  },

  getFriends: function () {
    console.log('clicked get friends!');
    // send query to the back end to return all friends to the friends store
    friendActions.getFriends();
  },

  render: function () {

    return (
      <div>
        <div className={"sidebar-wrapper " + (this.state.toggle ? 'slide' : '')}>
            <ul className="sidebar-nav row">
                <li className="col-md-4">
                  <button type="button" className="btn btn-default" onClick={this.getFriends}>Friends</button>
                </li>
                <li className="col-md-4">
                  <button type="button" className="btn btn-default">Rooms</button>
                </li>
                <li className="col-md-4">
                  <button type="button" className="btn btn-default">Add</button>
                </li>
            </ul>
            <div id="chat-space-top">
              <Friends></Friends>
              <Rooms></Rooms>
              <Add></Add>
            </div>
        </div>

        <div classN="page-content-wrapper">
          <a className="btn btn-default chat-button" id="menu-toggle" onClick={this.handleChatClick}><i className="fa fa-comment-o fa-2x" aria-hidden="true"></i></a>
        </div>

      </div>
    );
  }

});

module.exports = Main;

