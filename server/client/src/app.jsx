
var React = require('react');
var ReactDOM = require('react-dom');
var Route = require('react-router').Route;
var Router = require('react-router').Router;
var hashHistory = require('react-router').hashHistory;

var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;

// components to require below
var Auth = require('./components/auth.jsx');
var Chat = require('./components/chat/index.jsx');

var Chat = React.createClass({

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

  render: function render () {
    

    return (
      <div>

        <div id="wrapper">

          <div className={"sidebar-wrapper " + (this.state.toggle ? '' : 'slide')}>
              <ul className="sidebar-nav row">
                  <li className="sidebar-brand col-md-4">
                    <button type="button" className="btn btn-default">Friends</button>
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
        
        {this.props.children}
      </div>
    )
  }

});

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Chat} >
      <Route path="/auth" component={Auth} />
    </Route>
  </Router>
, document.getElementById('app'));
