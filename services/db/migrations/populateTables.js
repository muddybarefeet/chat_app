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

var insert = function (knex) {
  return knex('users')
  .insert([
    {username: 'muddybarefeet', email: '2muddybarefeet@gmail.com', password: 'anna'},
    {username: 'fine_filly', email: 'fine_filly01@hotmail.com', password: 'kate'},
    {username:'sarith21', email: 'sarith21@gmail.com', password:'rohan'},
    {username: 'justrp', email: 'ruan@hackreactor.com', password:'ruan'}
  ], '*')
  .then(function(userReturn) {
    return knex('friends')
    .insert([
      {friendor: '1',friendee: '2'},
      {friendor: '2',friendee: '1'},
      {friendor: '3',friendee: '1'},
      {friendor: '1',friendee: '4'}
    ], '*');
  })
  .catch(function (err) {
    console.log('error populating table', err);
  });

};