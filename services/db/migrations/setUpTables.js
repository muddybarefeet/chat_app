//run this file with node in the termial to set up the tables in postgres

//schemas to require
var users = require('../schemas/users.js');
var friends = require('../schemas/friends.js');
var rooms = require('../schemas/rooms.js');
var messages = require('../schemas/messages.js');
var usersRooms = require('../schemas/usersRooms.js');

//knex connection
var knex = require('knex');
var config = require('./../../../config.js');
var ENV = 'development';
var knex = knex(config.db[ENV]);


// var down = function (knex) {
//   return knex.schema.dropTable('friends')
//   .then(function (droppedFriends) {
//     return knex.schema.dropTable('users');
//   })
//   .catch(function (err) {
//     console.log('error dropping', err);
//   });
// };

var up = function (knex) {
  //set up my tables
  return users(knex)
  .then(function () {
    return friends(knex);
  })
  .then(function () {
    return rooms(knex);
  })
  .then(function () {
    return messages(knex);
  })
  .then(function () {
    return usersRooms(knex);
  })
  .catch(function (err) {
    console.log('error setting up tables', err);
  });
};

up(knex);