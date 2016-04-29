var Promise = require('bluebird');

module.exports = function (knex) {

  var fnHash = {};

  //make a room
  fnHash.createRoom = function (userId, roomName, status) {

    var isActive;

    return knex('rooms')
    .insert([{
      name: roomName,
      type: status,
      creator: userId
    }], '*')
    .then(function (insertedRowArray) {
      return knex('users_rooms')
      .insert([{
        roomId: insertedRowArray[0].r_id,
        userId: userId,
        accepted: true
      }], '*');
    })
    .then(function (arrayOfInsertedUserData) {
      return arrayOfInsertedUserData;
    })
    .catch(function (err) {
      console.log('error in making a public room ', err);
      throw err;
    });

  };

  //invite users to join a room
  fnHash.inviteUsers = function (userIdInviting, roomName, inviteeUsernames) {

    var usersArr;
    var rId;

    return knex.select()
    .from('users')
    .whereIn('username', inviteeUsernames)
    .then(function (userIdsArray) {
      usersArr = userIdsArray;
      //get the id of the room inviting to
      return knex.select('r_id')
      .from('rooms')
      .where('name', roomName);
    })
    .then(function (arrOfId) {

      rId = arrOfId[0].r_id;

      return knex.select('userId')
      .from('users_rooms')
      .whereIn('roomId', rId);
    })
    .then(function (usersAlreadyInvitedArr) {
      //flatten arr of objects
      var idsAlreadyInserted = usersAlreadyInvitedArr.map(function (user) {
        return user.userId;
      });
      //returns an array of users already inserted into the users rooms table THESE USER IDs do not want to be invited
      return Promise.map(usersArr, function (user) {
        //if the user is in the previous return then dont insert
        if (idsAlreadyInserted.indexOf(user.u_id) === -1) {
          return knex('users_rooms').insert([{
            roomId: rId,
            userId: user.u_id,
            accepted: false
          }],'*');
        } else {
          throw new Error("User has already been invited");
        }
      });
    })
    .then(function (dataReturned) {
      return dataReturned.map(function (dbReturn) {
        return dbReturn[0];
      });
    })
    .catch(function (err) {
      //do logic to catch custom errors before this(see users)
      console.log('error inviting users to a private room ', err);
      throw err;
    });
  };

  //join a room
  //-----------

  //1. can be invited to join a room: click on room --> send request to back end to check that they are in the users rooms
  //return yes/no to allow to see the room

  //2.can ask to join a room if public
  //click on the room --> send request and check that the room is public and then insert the user into the table with accepted true
  fnHash.joinRoom = function (userId, roomName) {

    var room_id;
    //get the id of the room
    return knex.select()
    .from('rooms')
    .where('name', roomName)
    .then(function (roomArr) {
      room_id = roomArr[0].r_id;
      //insert / update the user in users rooms table
      //get the user that matches the usrId if no matches then insert
      return knex.select()
      .from('users_rooms')
      .where('userId', userId)
      .andWhere('roomId', room_id);
    })
    .then(function (selectedData) {
      if (selectedData.length === 0) {
        return knex('users_rooms').insert([{
          roomId: room_id,
          userId: userId,
          accepted: true
        }],'*');
      } else {
        return knex('users_rooms')
        .where('userId', userId)
        .andWhere('accepted', false)
        .update({
          accepted: true
        }, '*');
      }
    })
    .then(function (insertedData) {
      if (insertedData.length === 0) {
        console.log('noting inseerted or updated in join room');
        throw err;
      }
      return insertedData;
    })
    .catch(function (err) {
      console.log('error in joining a room', err);
      throw err;
    });
  };

  //see pending room requests for the user
  //-------------------------
  //go to the users_rooms and get all accepted false that relate to the user
  //once have the array of these then get the room data for each one and return
  fnHash.getPeningRequests = function (userId) {

    return knex.select('roomId')
    .from('users_rooms')
    .where('userId', userId)
    .andWhere('accepted', false)
    .then(function (returnRows) {
      //loop through the array of roomIds and get the data from the rooms table and return
      var idsArray = returnRows.map(function (roomIdentifier) {
        return roomIdentifier.roomId;
      });
      return knex.select()
      .from('rooms')
      .whereIn('r_id', idsArray);
    })
    .catch(function (err) {
      console.log('error in seeing pending room invites', err);
      throw err;
    });

  };
  

  //see all rooms can join
  //-------------------------
  //go to rooms and return all that are public that you are not part of
  fnHash.notJoinedYet = function (userId) {

    var partOf = {};
    //get list of all rooms part of
    //then get list of all public rooms that not already joined
    return knex.select('roomId')
    .from('users_rooms')
    .where('userId', userId)
    .then(function (returnRows) {
      //flatten the array of into one hash
      returnRows.forEach(function (id) {
        partOf[id.roomId] = true;
      });
      return knex.select()
      .from('rooms')
      .where('type', 'public')
      .andWhere('creator', '<>', userId);
    })
    .then(function (roomsNotIn) {
      return roomsNotIn.map(function (room) {
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


  //see all rooms joined
  //---------------------------
  //users_rooms get all rows you are in and then get the room data accociated with these inputs
  fnHash.seeRoomsIn = function (userId) {
    var roomData = [];
    //select all the rows from the users rooms table that is in and then get this data from the rooms table
    return knex.select('roomId')
    .from('users_rooms')
    .where('userId', userId)
    .andWhere('accepted', true)
    .then(function (returnRows) {
      //flatten the array of into one hash
      returnRows.forEach(function (id) {
        roomData.push(id.roomId);
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

  //send message
  fnHash.sendMessage = function (userId, roomName, message) {

    //insert the message into the rooms messages table
    return knex.select('r_id')
    .from('rooms')
    .where('name', roomName)
    .then(function (roomId) {
      return knex('rooms_messages')
        .insert([{
        room_id: roomId[0].r_id,
        sender: userId,
        message: message
      }],'*');
    })
    .then(function (returnData) {
      //update the users messages by returning the content of the messages table
      return knex.select()
      .from('rooms_messages')
      .orderBy('created_at', 'asc');
    })
    .catch(function (err) {
      console.log('err in sending message', err);
      throw err;
    });

  };

  //get messages
  fnHash.getMessages = function (userId, roomName) {
    //go to the rooms table and the the id
    //then insert into the messages table
    return knex.select('r_id')
    .from('rooms')
    .where('name', roomName)
    .then(function (roomIdArr) {
      return knex.select()
      .from('rooms_messages')
      .where('room_id', roomIdArr[0].r_id)
      .orderBy('created_at', 'asc');
    })
    .catch(function (err) {
      console.log('err in getting messages', err);
      throw err;
    });

  };



  // //leave a room
  // //-------------------
  // fnHash.leaveRooms = function (userId) {

  //   //go to the users/rooms table and delete the entry for the user ------ extend to just have an isActive field
  //   return knex('users_rooms').where('userId', userId).update({isActive: false}, '*')
  //   .then(function (updatedRow) {
  //     console.log('update row in usersRooms table',updatedRow); //-------------------check need this then block
  //   });

  // };

  return fnHash;

};