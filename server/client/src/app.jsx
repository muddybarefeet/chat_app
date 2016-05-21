
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
      clicked: false
    };
  },

  handleChatClick: function () {
    console.log('clicked!');
    if (this.state.clicked) {
      this.setState({
        clicked: false
      });
    } else {
      this.setState({
        clicked: true
      });
    }
    // console.log('state', this.state.clicked);
  },

  render: function render () {

    var sidebar;

    if (this.state.clicked) {
      sidebar = 
      (<div className="sidebar-wrapper">
          <ul className="sidebar-nav">
              <li className="sidebar-brand">
                  <a href="#">
                      Start Bootstrap
                  </a>
              </li>
              <li>
                  <a href="#">Dashboard</a>
              </li>
              <li>
                  <a href="#">Shortcuts</a>
              </li>
              <li>
                  <a href="#">Overview</a>
              </li>
              <li>
                  <a href="#">Events</a>
              </li>
              <li>
                  <a href="#">About</a>
              </li>
              <li>
                  <a href="#">Services</a>
              </li>
              <li>
                  <a href="#">Contact</a>
              </li>
          </ul>
      </div>);
    }

    return (
      <div>

        <div id="wrapper">

          {sidebar}

          <div classN="page-content-wrapper">
              <div className="container-fluid">
                  <div className="row">
                      <div className="col-lg-12 text-left">
                          <a className="btn btn-default" id="menu-toggle" style={{"position":"fixed", "zIndex":"20", "right":"0"}} onClick={this.handleChatClick}><i className="fa fa-comment-o fa-2x" aria-hidden="true"></i></a>
                          <h1>Simple Sidebar</h1>
                          <p>This template has a responsive menu toggling system. The menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens. When toggled using the button below, the menu will appear/disappear. On small screens, the page content will be pushed off canvas.</p>
                          <p>Make sure to keep all page content within the <code>#page-content-wrapper</code>.</p>
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
