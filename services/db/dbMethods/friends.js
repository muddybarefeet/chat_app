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
    var pendingResquestOut = {};
    var pendingResquestIn = {};
    var friendsHash = {};
    //final hash
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
        
        //loop through the elements in the array of hashes. if the friendor id is the user then put it in pendingOut(if not already there)
        if (element.friendor === userId && !pendingResquestOut[friendId]) {
          pendingResquestOut[friendId] = true;
        } else if (element.friendor === friendId) {
        //if this friend is already in the pendingOut and the friendor is not the user then add here, else add to friends
          if (pendingResquestOut[friendId]) {
            delete pendingResquestOut[friendId];
            friendsHash[friendId] = true;
          } else {
            pendingResquestIn[friendId] = true;
          }
        }


      });
      //take the contents of the hashes and get all friends details
      var friends = Object.keys(friendsHash);
      return knex.select('u_id', 'username', 'email')
      .from('users')
      .whereIn('u_id', friends);

    })
    .then(function (returnFriends) {
      //get all pending friends details
      friendsData.friends = returnFriends;
      var pending = Object.keys(pendingResquestOut);
      return knex.select('u_id', 'username', 'email')
      .from('users')
      .whereIn('u_id', pending);

    })
    .then(function (returnPending) {
      //get all pendingIn friends details
      friendsData.pending = returnPending;
      var pendingIn = Object.keys(pendingResquestIn);
      return knex.select('u_id', 'username', 'email')
      .from('users')
      .whereIn('u_id', pendingIn);

    }).then(function (returnPendingIn) {
      friendsData.pendingIn = returnPending;
      return friendsData;
    });
  };

  //get a list of all users not friends with to the client
  // //-------------------------------------
  module.showWhoCanFriend = function (userId) {
    var notYetFriends;
    //return all ids from the friends table that are not associated with the user
    return knex.select('friendor', 'friendee')
    .from('friends')
    .whereNot('friendor', userId)
    .orWhereNot('friendee', '=', userId)
    .then(function(notYetFriendsArray) {
      //take the array of ids not accosiated with the user and get the details from the user table
      //make one list of all the friendIds
      notYetFriendsArray.forEach(function (element) {
        notYetFriends[element.friendor] = true;
        notYetFriends[element.friendee] = true;
      });
      //take the new hash of values and get the users data
      var ids = Object.keys(notYetFriends);
      return knex.select('u_id', 'username', 'email')
      .from('users')
      .whereIn('u_id', ids);
    })
    .then(function (arrayUserInformation) {
      //return array of user objects to the client
      return arrayUserInformation;
    });

  };

  return module;

};