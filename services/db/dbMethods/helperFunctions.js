
module.exports = function (knex) {

  var returnHash = {};

  returnHash.getFriends = function (userId) {
    console.log('IN THE GET FRINEDS FN', userId);
    var friendsData = {
      pendingRequestOut: {},
      pendingRequestIn: {},
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
        // console.log('element',usersData);
        //if friendor or friendee is the user in the element then the other value is the friendId
        var friendId;
        // get the id of a friend
        if ( element.friendor === userId || element.friendee === userId ) {
          if ( element.friendor === userId ) {
            friendId = element.friendee;
            // if the user has not already asked then put in out
            if (!friendsData.pendingRequestOut[friendId]) {
              friendsData.pendingRequestOut[friendId] = friendId;
            } else {
              delete friendsData.pendingRequestOut[friendId];
              friendsData.friendsHash[friendId] = friendId;
            }
          } else {
            friendId = element.friendor;
            friendsData.pendingRequestIn[friendId] = friendId;
            if (!friendsData.pendingRequestIn[friendId]) {
              friendsData.pendingRequestIn[friendId] = friendId;
            } else {
              delete friendsData.pendingRequestIn[friendId];
              friendsData.friendsHash[friendId] = friendId;
            }
          }
          //check that it has not been alrady put in the friendsData.notyetfriends hash, if it has then delet it from this hash
          if ( friendsData.notYetFriends[friendId] ) {
            delete friendsData.notYetFriends[friendId];
          }
        } else {
          //if the user is not in the element then put both into the friendsData.notYetFriends has
          friendsData.notYetFriends[element.friendor] = element.friendor;
          friendsData.notYetFriends[element.friendee] = element.friendee;
        }

        //loop through the elements in the array of hashes. 
        //if the friendor id is the user then put it in pendingOut(if not already there)
        // if (element.friendor === userId && !friendsData.pendingRequestOut[friendId]) {
        //   friendsData.pendingRequestOut[friendId] = friendId;
        // } else if (element.friendor === friendId) {
        //   console.log('if the friendor is the friend',element, friendsData.pendingRequestOut);
        // //if this friend is already in the pendingOut and the friendor is not the user then add here, else add to friends
        //   if (friendsData.pendingRequestOut[friendId]) {

        //     delete friendsData.pendingRequestOut[friendId];
        //     friendsData.friendsHash[friendId] = friendId;
        //   } else {
        //     friendsData.pendingRequestIn[friendId] = friendId;
        //   }
        // }

      });
      //loop through the users array of hashes
      //if the u_id is not in any of the other hashes then put the user object in the friendsData.notyetfriends hash
      usersData.forEach(function (user) {
        //look in the three hashes for the user.u_id
        if (friendsData.pendingRequestOut[user.u_id]) {
          friendsData.pendingRequestOut[user.u_id] = user;
        } else if (friendsData.pendingRequestIn[user.u_id]) {
          friendsData.pendingRequestIn[user.u_id] = user;
        } else if (friendsData.friendsHash[user.u_id]) {
          friendsData.friendsHash[user.u_id] = user;
        } else if (user.u_id !== userId) {
          friendsData.notYetFriends[user.u_id] = user;
        }
      });
      // console.log("in controller",friendsData);
      return friendsData;

    })
    .catch(function (err) {
      console.log('this is an error from the getFriends fn in the controller');
      throw err;
    });
  };

  return returnHash;

};
