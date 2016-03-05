var knex = require('knex');
var config = require('./../../config.js');

var ENV = 'development';
var knex = knex(config.db[ENV]);

var methods = {};

methods.users = require('./dbMethods/users')(knex);
methods.friends = require('./dbMethods/friends')(knex);

module.exports = methods;