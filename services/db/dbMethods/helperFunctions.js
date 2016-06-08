
module.exports = function (knex) {

  var returnHash = {};

  returnHash.getFriends = function (userId) {

    var friendsData = {
      pendingRequestOut: {},
      pendingRequestIn: {},
      friends: {},
      notYetFriends: {}
    };

    //store of the users data from the database
    var usersData;

    return knex.select()
    .from('users')
    .then(function(usersRows) {
      usersData = usersRows;
      // loop though all users and as long as the user is not the current user then add the ud to the notYetFriends object
      usersData.forEach(function(user) {
        if (user.u_id !== userId) {
          friendsData.notYetFriends[user.u_id] = user.u_id;
        }
      });
      // console.log('friends', friendsData.notYetFriends);
      return knex.select('friendor', 'friendee')
      .from('friends');
      // where one of then ids is the users
    })
    .then(function (friendsRows) {
      console.log(friendsRows);
      //look through the list of friends and extract the friend information
      friendsRows.forEach(function(element) {
        // find the friendId
        var friendId;
        // get the id of a friend
        if ( element.friendor === userId || element.friendee === userId ) {
          if ( element.friendor === userId ) {
            friendId = element.friendee;
          } else {
            friendId = element.friendor;
          }
        }

        // 1. they may be being asked to be a friend in pendingIn
        // if the friendee is in pendingIn the delete and add to friends
        if (element.friendor === userId) {
          if (friendsData.pendingRequestIn[friendId] && !friendsData.friends[friendId]) {
            delete friendsData.pendingRequestIn[friendId];
            friendsData.friends[friendId] = friendId;
          }
        } if (element.friendor === friendId) {
        // 2. else someone is sending a request to them and needs to put friendee in pendingIn
          if (!friendsData.pendingRequestIn[friendId] && !friendsData.friends[friendId]) {
            friendsData.pendingRequestIn[friendId] = friendId;
            // remove the the id from not yet friends
            delete friendsData.notYetFriends[friendId];
          }
        }

      });
      //loop through the users array of hashes
      //if the u_id is not in any of the other hashes then put the user object in the friendsData.notyetfriends hash
      usersData.forEach(function (user) {
        //look in the three hashes for the user.u_id
        if (friendsData.pendingRequestOut[user.u_id]) {
          friendsData.pendingRequestOut[user.u_id] = user;
        } else if (friendsData.pendingRequestIn[user.u_id]) {
          friendsData.pendingRequestIn[user.u_id] = user;
        } else if (friendsData.friends[user.u_id]) {
          friendsData.friends[user.u_id] = user;
        } else if (user.u_id !== userId) {
          friendsData.notYetFriends[user.u_id] = user;
        }
      });
      // console.log("in controller",friendsData);
      return friendsData;

    })
    .catch(function (err) {
      console.log('this is an error from the getFriends fn in the helper methods');
      throw err;
    });
  };

  returnHash.getMessages = function () {
    return knex.select('u_id')
    .from('users')
    .where('username', otherUsername)
    .then(function (otherUserId) {
      if (otherUserId.length !== 1) {
        throw new Error("The username: "+otherUsername+" does not exist");
      }
      return knex.select()
      .from('messages')
      .where(function () {
        this.where('sender_id', userId)
        .andWhere('reciever_id', otherUserId[0].u_id);
      })
      .orWhere(function () {
        this.where('sender_id', otherUserId[0].u_id)
        .andWhere('reciever_id', userId);
      })
      .orderBy('created_at', 'asc');
    })
    .then(function (selectedMessages) {
      //loop through the array of users messages and add to the userMessages hash accordingly
      return selectedMessages;
    })
    .catch(function (err) {
      console.log('err messages betwen user and friend', err);
      throw err;
    });
  };

  return returnHash;

};
