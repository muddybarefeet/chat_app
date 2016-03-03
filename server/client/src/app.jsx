
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

var Nav = React.createClass({

  render: function render () {

    return (
      <div>

        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Anna Chat</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Settings<span className="caret"></span></a>
                  <ul className="dropdown-menu">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#">Separated link</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        {this.props.children}
      </div>
    )
  }

});

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Nav} >
      <Route path="/auth" component={Auth} />
      <Route path="/chat" component={Chat} />
    </Route>
  </Router>
, document.getElementById('app'));
