
var React = require('react');
var ReactDOM = require('react-dom');
var Route = require('react-router').Route;
var Router = require('react-router').Router;
var hashHistory = require('react-router').hashHistory;

var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;

// components to require below
var Auth = require('./components/auth.jsx');
// var Chat = require('./components/chat/index.jsx');
var Home = require('./components/home/index.jsx');

var Chat = React.createClass({

  getInitialState: function() {
    return {
      toggle: false
    };
  },

  handleChatClick: function () {
    this.setState({
      toggle: this.state.toggle ? false : true
    });

  },

  logout: function () {
    console.log('logging out');
    localStorage.clear();
    window.location.hash = "#/auth";
  },

  render: function render () {

    return (
      <div>

        <div id="wrapper">

          <Home></Home>
          <button type="button" className="btn btn-primary" onClick={this.logout}>Logout</button>

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
