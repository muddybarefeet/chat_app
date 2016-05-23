//this is the index for the main page of the app! to be made ....
var friendActions = require('./../../actions/friendActions.js');

var React = require('react');
var Link = require('react-router').Link;

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

  },

  render: function () {

    return (
      <div>

        <div className={"sidebar-wrapper " + (this.state.toggle ? '' : 'slide')}>
            <ul className="sidebar-nav row">
                <li className="sidebar-brand col-md-4">
                  <button type="button" className="btn btn-default" onClick={this.getFriends}>Friends</button>
                {/*here have component to display the friends*/}
                </li>
                <li className="sidebar-brand col-md-4">
                  <button type="button" className="btn btn-default">Rooms</button>
                </li>
                <li className="sidebar-brand col-md-4">
                  <button type="button" className="btn btn-default">Add</button>
                </li>
            </ul>
        </div>

        <div classN="page-content-wrapper">
          <div className="container-fluid">
              <div className="row">
                  <div className="col-lg-12 text-left">
                    <a className="btn btn-default chat-button" id="menu-toggle" onClick={this.handleChatClick}><i className="fa fa-comment-o fa-2x" aria-hidden="true"></i></a>
                    <h1>Good Morning Anna!</h1>
                  </div>
              </div>
          </div>
        </div>

      </div>
    );
  }

});

module.exports = Main;

