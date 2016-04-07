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
    var pendingResquests = {};
    var friendsHash = {};
    var friendsData = {};
    //get all the rows which have the user id in
    return knex.select('friendor', 'friendee')
    .from('friends')
    .where('friendor', '=', userId)
    .orWhere('friendee', '=', userId)
    //get data on who is friends with who and who is pending
    //get all numbers out that are not the user and query against the user table
    .then(function(rowsMatch) {
      console.log("MAtched rows",rowsMatch);
      //look through the objects array
      rowsMatch.forEach(function(element) {
        //get the id that is not the users
        var friendId;
        if ( element.friendor === userId ) {
          friendId = element.friendee;
        } else {
          friendId = element.friendor;
        }
        //once have the friend id then add to the pending request object
        //if already in the pending request then add to the friends
        if ( pendingResquests[friendId] ) {
          delete pendingResquests[friendId];
          friendsHash[friendId] = true;
        } else {
          pendingResquests[friendId] = true;
        }

      });
      //take the contents of the hashes and get all friends details
      var friends = Object.keys(friendsHash);
      return knex.select('u_id', 'username', 'email').from('users')
      .whereIn('u_id', friends);

    }).then(function (returnFriends) {
      //get all pending friends details
      friendsData.friends = returnFriends;
      var pending = Object.keys(pendingResquests);
      return knex.select('u_id', 'username', 'email').from('users')
      .whereIn('u_id', pending);

    }).then(function (returnPending) {

      friendsData.pending = returnPending;
      return friendsData;

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