

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

  //invite users to join a private room
  // fnHash.inviteUsers = function (userIdInviting, roomName, inviteeUsernames) {

  //   var usersArr;

  //   return knex.select('u_id')
  //   .from('users')
  //   .whereIn('username', inviteeUsernames)
  //   .then(function (userIdsArray) {
  //     usersArr = userIdsArray;
      
  //   })

  // };

  //get all of the rooms the user is part of/has been inited to
  //-------------------------------------
  // fnHash.getRooms = function (userId) {
  //   //join table between users and rooms to use
  //   //go to this join table and get the all room ids where the user is
  //   return knex.select('roomId').from('usersRooms.js').where('userId', userId)
  //   .then(function (arrayOfIds) {
  //     //go to the rooms table and for each room id get the row in the table corespondeing to the id
  //     arrayOfIds.forEach(function (roomId) { //----------------------------------------------CHEK THIS BIT OUT PROPERLY!!
  //       return knex.select().table('rooms').where('r_id', roomId);
  //     });
  //   });


  // //return all joinable rooms----- there could later show private rooms and one has to conact the room person for auth to join a room 
  // //-----------------------------------------------
  // fnHash.getJoinableRooms = function (userId) {

  //   //go to the rooms table and return all the rooms which have a type of public
  //   return knex('rooms').select().where('status', 'public')
  //   .then(function (arrayOfRooms) {
  //     console.log('all public rooms', arrayOfRooms);
  //   });
    
  // };


  // //join a room
  // //-------------------------------------
  // fnHash.joinRoom = function (userId, roomName, peopleInvited) {

  //   var roomId;
  //   //find the room in the rooms table and get the id
  //   return knex.select('r_id').from('rooms').where('name', roomName)
  //   .then(function (room) {
  //     //add the user id and the roomId to the rooms/users table
  //     roomId = roomId[0];
  //     return knex('rooms').insert([{ roomId: roomId, userId: userId, creator: false }], '*');
  //   })
  //   .then(function (insertedRow) {
  //     //get the ids for the invited people and add them with the table id to the users/rooms table
  //     console.log('new room joined', insertedRow);
  //     peopleInvited.forEach(function (username) {
  //       //get the id
  //       //add to the users/rooms table
  //       //---------------------------------------------SORT!!
  //     });
  //   });
    
  // };





  // //get all messages for the selected room
  // //-------------------------------------
  // fnHash.getMessages = function (userId, room) {

  //   //get the roomId from the rooms table
  //   return knex.select('r_id').from('rooms').where('name', room)
  //   //find all messages with this room id
  //   .then(function (room) {
  //     return knex.select().from('messages').where('m_id', room[0]);
  //   })
  //   //send to client
  //   .then(function (messageRow) {
  //     console.log('messages', messageRow);
  //   });

  // };

  // //add new message to the room
  // //-------------------------------------
  // fnHash.newMessage = function (userId, message, whoFrom, whoFor, room) {

  //   var roomId;
  //   var recipientId;
  //   //get the roomId
  //   return knex.select('r_id').from('rooms').where('name', room)
  //   .then(function (room) {
  //     roomId = room[0];
  //     //get the id of the person to send the message to ------- here not verifying that they are frineds as would not seem them to message if not friends
  //     return knex.select('u_id').from('users').where('username', whoFor);
  //   })
  //   .then(function (userId) {
  //     recipientId = userId[0];
  //     //insert the roomId, message, sender, and reciever into the messages table
  //     return knex('messages').insert(
  //       [
  //         {
  //           sender_id: userId,
  //           reciever_id: recipientId,
  //           message: message
  //         }
  //       ], '*');
  //   })
  //   .then(function (insertedMessages) {
  //     console.log('inserted message', insertedMessages);
  //   });

  // };

    
  // };



  // //leave a room
  // //-------------------
  // fnHash.getJoinableRooms = function (userId) {

  //   //go to the users/rooms table and delete the entry for the user ------ extend to just have an isActive field
  //   return knex('users_rooms').where('userId', userId).update({isActive: false}, '*')
  //   .then(function (updatedRow) {
  //     console.log('update row in usersRooms table',updatedRow); //-------------------check need this then block
  //   });

  // };

  return fnHash;

};