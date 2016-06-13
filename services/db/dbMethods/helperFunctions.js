
module.exports = function (knex) {

  var returnHash = {};

  returnHash.getFriends = function (userId) {
    console.log('userid', userId);
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

        // 1. if the user is the friendor check that they have not already been asked to be friends(pendingIn)
        // if they have then make them friends
        // else put in pendingOut
        if (element.friendor === userId) {
          if (friendsData.pendingRequestIn[friendId] && !friendsData.friends[friendId]) {
            console.log('should come in this if if already in pending in');
            delete friendsData.pendingRequestIn[friendId];
            friendsData.friends[friendId] = friendId;
          } else if (!friendsData.pendingRequestIn[friendId] && !friendsData.friends[friendId]) {
            friendsData.pendingRequestOut[friendId] = friendId;
            delete friendsData.notYetFriends[friendId];
          }
        } if (element.friendor === friendId) {
        // 2. if the friend is the friendor then check if they are in pendingOut(been asked by the user to be a friend)
        // if they are then make them a friend
        // else make put in pendingIn
          if (friendsData.pendingRequestOut[friendId] && !friendsData.friends[friendId]) {
            delete friendsData.pendingRequestOut[friendId];
            friendsData.friends[friendId] = friendId;
          } else if (!friendsData.pendingRequestOut[friendId] && !friendsData.friends[friendId]) {
            friendsData.pendingRequestIn[friendId] = friendId;
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

      return friendsData;

    })
    .catch(function (err) {
      console.log('this is an error from the getFriends fn in the helper methods');
      throw err;
    });
  };

  returnHash.getMessages = function (userId, otherUsername) {
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

  returnHash.getUnreadMessages = function (userId) {
    var data = {};
    return knex.select('sender_id')
      .from('messages')
      .where('reciever_id', userId)
      .andWhere('has_been_read', false)
    .then(function (selectedUserIds) {
      selectedUserIds.map(function (id) {
        if (data[id.sender_id]) {
          data[id.sender_id]++;
        } else {
          data[id.sender_id] = 1;
        }
      });
      return data;
    })
    .catch(function (err) {
      console.log('err in getting a users unread messages from friends', err);
      throw err;
    });
  };

  returnHash.getRooms = function (userId) {
    var roomData = [];
    //select all the rows from the users rooms table that is in and then get this data from the rooms table
    return knex.select('room_id')
    .from('users_rooms')
    .where('user_id', userId)
    .andWhere('accepted', true)
    .then(function (returnRows) {
      //flatten the array of into one hash
      returnRows.forEach(function (id) {
        roomData.push(id.room_id);
      });
      return knex.select()
      .from('rooms')
      .whereIn('r_id', roomData);
    })
    .catch(function (err) {
      console.log('err in see rooms part of', err);
      throw err;
    });
  };

  returnHash.joinable = function (userId) {
    var partOf = {};
    //get list of all rooms part of
    //then get list of all public rooms that not already joined
    return knex.select('room_id')
    .from('users_rooms')
    .where('user_id', userId)
    .then(function (returnRows) {
      //flatten the array of into one hash
      returnRows.forEach(function (id) {
        partOf[id.room_id] = true;
      });
      console.log('part of', partOf);
      return knex.select()
      .from('rooms')
      .where('type', 'public')
      .andWhere('creator', '<>', userId);
    })
    .then(function (roomsNotIn) {
      return roomsNotIn.filter(function (room) {
        if ( !partOf.hasOwnProperty(room.r_id) ) {
          return room;
        }
      });
    })
    .catch(function (err) {
      console.log('error in finding rooms you can join', err);
      throw err;
    });
  };

  return returnHash;

};
