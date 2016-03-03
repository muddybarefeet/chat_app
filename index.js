
//start up services
var services = require('./services/index.js');

//start server
var app = require('./server/index.js')(services);
