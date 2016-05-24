

module.exports = function (knex) {

  var fnHash = {};

//enters into the friends table the user making a friend request
//-------------------------------------
  fnHash.sendFriendReqest = function (userId, nameOfRecipiant) {
    var recipientId;
    //get the user ids of both users
    //should have user who sent the requests on the jwt
    return knex('users')
    .where('username', nameOfRecipiant)
    .then(function (user) {
      if (user.length !== 1) {
        throw new Error("The user: "+nameOfRecipiant+" does not exist");
      }
      //get the nameOfRecipiant id
      recipientId = user[0].u_id;
      //then insert both ids to the friends table
      return knex('friends')
      .insert({
        friendor: userId,
        friendee: recipientId
      }, "*");
    })
    .then(function (friendRow) {
      return friendRow[0];
    })
    .catch(function (err) {
      console.log('this is an error from the makeConnection fn in the controller');
      throw err;
    });

  };


// enters into the friends table the confimer friend request
// -------------------------------------
  fnHash.confirmRequest = function (userId, withWho) {
    //take the confirmed id and look for it in the friends table
    //get the userId id from the jwt
    return knex('users')
    .where('username', withWho)
    .then(function (user) {
      if (user.length !== 1) {
        throw new Error("The user: "+withWho+" does not exist");
      }
      //insert a new row into the friends table
      return knex('friends')
      .insert({
        friendor: userId,
        friendee: user[0].u_id
      }, '*');
    })
    .then(function (newRow) {
      return newRow[0];
    })
    .catch(function (err) {
      console.log('this is an error from the confirmRequest fn in the controller');
      throw err;
    });

  };

  
  // looks at the fiends table and returns all users friends from the users table
  //-------------------------------------
  //JOIN the tables want and then filter out what not want!
  // join the users and friends tables then filter

  fnHash.getFriends = function (userId) {
    console.log('userID METHOD: ', userId);
    var friendsData = {
      pendingResquestOut: {},
      pendingResquestIn: {},
      friendsHash: {},
      notYetFriends: {}
    };

    //store of the users data from the database
    var usersData;

    return knex.select()
    .from('users')
    .then(function(usersRows) {
      usersData = usersRows;
      return knex.select('friendor', 'friendee')
      .from('friends');
    })
    .then(function (friendsRows) {
      //look through the list of friends and extract the friend information
      friendsRows.forEach(function(element) {
        //if friendor or friendee is the user in the element then the other value is the friendId
        var friendId;
        if ( element.friendor === userId || element.friendee === userId ) {
          if ( element.friendor === userId ) {
            friendId = element.friendee;
          } else {
            friendId = element.friendor;
          }
          //check that it has not been alrady put in the friendsData.notyetfriends hash, if it has then delet it from this hash
          if ( friendsData.notYetFriends[friendId] ) {
            delete friendsData.notYetFriends[friendId];
          }
        } else {
          //if the user is not in the element then put both into the friendsData.notYetFriends has
          friendsData.notYetFriends[element.friendor] = true;
          friendsData.notYetFriends[element.friendee] = true;
        }

        //loop through the elements in the array of hashes. if the friendor id is the user then put it in pendingOut(if not already there)
        if (element.friendor === userId && !friendsData.pendingResquestOut[friendId]) {
          friendsData.pendingResquestOut[friendId] = true;
        } else if (element.friendor === friendId) {
        //if this friend is already in the pendingOut and the friendor is not the user then add here, else add to friends
          if (friendsData.pendingResquestOut[friendId]) {
            delete friendsData.pendingResquestOut[friendId];
            friendsData.friendsHash[friendId] = true;
          } else {
            friendsData.pendingResquestIn[friendId] = true;
          }
        }

      });
      //loop through the users array of hashes
      //if the u_id is not in any of the other hashes then put the user object in the friendsData.notyetfriends hash
      usersData.forEach(function (user) {
        //look in the three hashes for the user.u_id
        if (friendsData.pendingResquestOut[user.u_id]) {
          friendsData.pendingResquestOut[user.u_id] = user;
        } else if (friendsData.pendingResquestIn[user.u_id]) {
          friendsData.pendingResquestIn[user.u_id] = user;
        } else if (friendsData.friendsHash[user.u_id]) {
          friendsData.friendsHash[user.u_id] = user;
        } else if (user.u_id !== userId) {
          friendsData.notYetFriends[user.u_id] = user;
        }
      });

      return friendsData;

    })
    .catch(function (err) {
      console.log('this is an error from the getFriends fn in the controller');
      throw err;
    });
  };

  return fnHash;

};