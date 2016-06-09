
module.exports = function (knex, helpers) {

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


// enters into the friends table the confirmed friend request
// ---------------------------------------------------------
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
      return helpers.getFriends(userId);
    })
    .catch(function (err) {
      console.log('this is an error from the confirmRequest fn in the controller');
      throw err;
    });

  };


  // remove the friend from your pending request friends to notYetFriends pile
  // ------------------------------------------------------------------------
  fnHash.rejectRequest = function (userId, withWho) {
    return knex('users')
    .where('username', withWho)
    .then(function (user) {
      if (user.length !== 1) {
        throw new Error("The user: "+withWho+" does not exist");
      }
      // delete the row in the table that was the request to the user to be a friend
      return knex('friends')
      .where('friendor', user[0].u_id)
      .del();
    })
    // when the get friends function is called the user that asked to be a friend will be put back into the notYetFriend hash
    .then(function(data) {
      return helpers.getFriends(userId);
    })
    .catch(function (err) {
      console.log('this is an error from the rejectRequest fn in the controller');
      throw err;
    });
  };

  
  // looks at the fiends table and returns all users friends from the users table
  //-------------------------------------
  //JOIN the tables want and then filter out what not want!
  // join the users and friends tables then filter

  fnHash.getFriends = function (userId) {
    
    var friendsData = {};
    var unread;

    return helpers.getFriends(userId)
    .then(function (friendsHash) {
      friendsData = friendsHash;
      return helpers.getUnreadMessages(userId);
    })
    .then(function (unreads) {
      console.log('2', unreads);
      unread = unreads;
      for (var key in friendsData.friends) {
        if (unread.indexOf(key) !== -1) {
          friendsData.friends[key].unread = true;
        } else {
          console.log('not got unreads', friendsData.friends[key]);
          friendsData.friends[key].unread = false;
        }
      }
      return friendsData;
    });

  };

  return fnHash;

};