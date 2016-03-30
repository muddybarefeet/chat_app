// var Promise = require('bluebird');
var pg = require('pg-native');

module.exports = function (knex) {

  var module = {};

//enters into the friends table the user making a friend request
//-------------------------------------
  module.makeConnection = function (userId, nameOfRecipiant) {
    var recipientId;
    //get the user ids of both users
    //should have user who sent the requests on the jwt
    return knex('users').where('username', nameOfRecipiant)
    .then(function (user) {
      //get the nameOfRecipiant id
      recipientId = user[0].u_id;
      //then insert both ids to the friends table
      return knex('friends')
      .insert({ friendor: userId, friendee: recipientId}, "*");
    })
    .then(function (friendRow) {
      console.log('friend row from connection', friendRow);
      return friendRow[0];
    });

  };


// enters into the friends table the confimer friend request
// -------------------------------------
  module.confirmRequest = function (userId, withWho) {
    //take the confirmed id and look for it in the friends table
    //get the userId id from the jwt
    return knex('users').where('username', withWho)
    .then(function (user) {
      console.log('user ',user);
      //insert a new row into the friends table
      return knex('friends')
      .insert({friendor: user[0].u_id, friendee: userId}, '*');
    })
    .then(function (newRow) {
      console.log('new row: ',newRow);
      return newRow;//this returns the number of affected rows---> should only ever be one
    });

  };

  // looks at the fiends table and returns all users friends from the users table
  //-------------------------------------
  //JOIN the tables want and then filter out what not want!
  // join the users and friends tables then filter?

  module.getFriends = function (userId) {
    //take the rows with user in frindor
    //take rows with user in friendee
    //compare and return the ones that match
    //OR
    //join the users and friends table and select the rows

  };

  //get a list of all users not friends with to the client
  // //-------------------------------------
  // module.showWhoCanFriend = function (userId) {

  //   //get a list of all user id's
  //   //call the getFriends and get all friends
  //   //find the difference and return ones not in getFriends result




  // };

  return module;

};