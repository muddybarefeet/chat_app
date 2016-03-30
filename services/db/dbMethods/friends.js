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
    //get all the rows which have the user id in
    return knex.select('friendor', 'friendee')
    .from('friends')
    .where('friendor', '=', userId)
    .orWhere('friendee', '=', userId)
    //get data on who is friends with who and who is pending
    //get all numbers out that are not the user and query against the user table
    .then(function(rowsMatch) {
      console.log(rowsMatch);
      //look through the objects array
      //make pending request hash
      //pending accept hash
      //friends hash
      //go through array and update hashes 
      rowsMatch.map(function(id) {

      });

    });
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