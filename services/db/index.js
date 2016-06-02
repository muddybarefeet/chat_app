var knex = require('knex');
var config = require('./../../config.js');

var ENV = 'development';
var knex = knex(config.db[ENV]);

var methods = {};

var helperFunctions = require('./dbMethods/helperFunctions')(knex);

methods.users = require('./dbMethods/users')(knex, helperFunctions);
methods.friends = require('./dbMethods/friends')(knex, helperFunctions);
methods.messages = require('./dbMethods/messages')(knex, helperFunctions);
methods.rooms = require('./dbMethods/rooms')(knex, helperFunctions);

module.exports = methods;