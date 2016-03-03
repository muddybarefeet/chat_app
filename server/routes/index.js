//express server routes
//ALL ROUTES NEED TO DECRYPT JWTS EXCEPT USERS
var fs = require('fs');

//requiring the used middleware
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//export object that gets called from the express server ./../index.js
module.exports = function (services) {

  var router = express.Router();
  router.use(bodyParser());

  var routes = [];

  fs.readdirSync(__dirname + '/routeFiles').forEach(function (fileName) { //array of all file and folder names here
    if (fileName !== '.DS_Store' && fileName !== 'utils.js') {
      routes.push(fileName);
    }
  });

  routes.forEach(function (fileName) {
    var file = require('./routeFiles/' + fileName)(services);
    var newName = fileName.split('.')[0];
    router.use('/' + newName, file);
  });

  return router;
  
};

  


