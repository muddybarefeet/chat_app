
//this index is the express server for our app
var express = require('express');
var router = require('./routes/index.js');

//morgan logs the requests to the server and body parser
//populate the req.body property with the parsed body
var morgan = require('morgan');
var bodyParser = require('body-parser');

module.exports = function(services){

  var port = process.env.PORT || 3000;

  var app = express();

  app.use(morgan('dev'));
  app.use(bodyParser.json());

  //connection to the routes in ./routes folder
  app.use('/api', router(services));

  //wild card route to anything not starting /api
  //send html
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
  });

  //then make all client file assests available to find the file searching for
  app.use('/', express.static(__dirname + '/client'));

  app.listen(port);
  console.log("Express server listening on port", port);

  return app;

};
