//database connection
//facebook auth keys here too?
var knex = require('knex');

var config = {

  db: {
    
    development: {
      client: 'pg',
      connection: {
        host: "127.0.0.1",
        database: 'chat_app'
      }
    }
  }

};

module.exports = config;