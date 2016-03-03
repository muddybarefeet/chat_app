// var Promise = require('bluebird');

module.exports = function (knex) {

  var module = {};

//enters into the friends table the user making a friend request
//-------------------------------------
  module.makeConnection = function (whoMake, whoFor) {

    var recipientId;
    //get the user ids of both users
    //should have user who sent the requests on the jwt
    return knex('users').where('username', whoFor)
    .then(function (user) {
      //get the whoFor id
      recipientId = user[0].u_id;
      //then insert both ids to the friends table
      return knex('friends').insert({ f_id: whoMake, userSentId: recipientId, requestAccepted: null});
    })
    .then(function (friendRow) {
      console.log('friend row from connection', friendRow);
    });

  };


//enters into the friends table the confimer friend request
//-------------------------------------
  module.confirmConnection = function (userId, withWho, status) {

    //take the confirmed id and look for it in the friends table
    //get the userId id from the jwt
    return knex('users').where('username', withWho)
    .then(function (user) {
      return knex.select()
      .from('friends')
      .where('userToConfirmId', userId)
      .andWhere('userSentId', user[0].u_id)
      .andWhere('requestAccepted', null);
    })
    .then(function (connectionRow) {
      //take the user connection and update the values in 'requestAccepted'

      if (status === 'accept') {
        return knex('friends').update('requestAccepted', 'true').where('f_id', connectionRow[0].f_id);
      } else {
        return knex('friends').update('requestAccepted', 'false').where('f_id', connectionRow[0].f_id);
      }
    })
    .then(function (updatedRow) {
      console.log('updated row', updatedRow);
    });

    //when found the row then if status is accept then accept is reject then reject

  };

  //looks at the fiends table and returns all users friends from the users table
  //-------------------------------------
  module.returnUsersFriends = function (userId) {

    //look in friends table for the user in 1 of two columns
    return knex.select()
    .from('friends')
    .where('userSentId', userId)
    .orWhere('userToConfirmId', userId)
    .andWhere('requestAccepted', true)
    //make list of all ids
    .then(function (arrayOfFriends) {
      //loop through the objects and extract the ones that are not the userId
      return arrayOfFriends.forEach(function (friend) {
        if (friend.userSentId !== userId) {
          return friend.userSentId;
        } else {
          return friend.userSentId;
        }
      });

    })
    .then(function (arrayOfFriendIds) {
      //look them up in the users table 
      return arrayOfFriendIds.map(function (friendId) {
        //take the ids and look up the rest of the user information
        return knex.select().from('users').where('u_id', friendId);
      });

    })
    .then(function (arrayOfuserInformation) {
      console.log('userInformation', arrayOfuserInformation);

    });


  };

  return module;

};