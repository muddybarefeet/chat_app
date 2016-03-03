// var Promise = require('bluebird');

module.exports = function (knex) {

  var module = {};

  //get all messages for the selected room
  //-------------------------------------
  module.getMessages = function (userId, room) {

    //get the roomId from the rooms table
    return knex.select('r_id').from('rooms').where('name', room)
    //find all messages with this room id
    .then(function (room) {
      return knex.select().from('messages').where('m_id', room[0]);
    })
    //send to client
    .then(function (messageRow) {
      console.log('messages', messageRow);
    });

  };

  //add new message to the room
  //-------------------------------------
  module.newMessage = function (userId, message, whoFrom, whoFor, room) {

    //get the roomId
    //insert the roomId, message, sender, and reciever into the messages table

  };

  //get all of the rooms the user is part of
  //-------------------------------------
  module.getRooms = function (userId) {

    //join table between users and rooms to use
    //go to this join table and get the all room ids where the user is
    //go to the rooms table and extract the rooms that match the ids
    
  };

  //create a room
  //-------------------------------------
  module.createRoom = function (userId, roomName, status) {

    //insert a new room into the rooms table status: private/public
    //insert a user and room id into the users/rooms join table
    
  };

  //join a room
  //-------------------------------------
  module.joinRoom = function (userId, roomName, peopleInvited) {

    //find the room in the rooms table and get the id
    //add the user id and the roomid to the rooms/users table
    //get the ids for the invited people and add them with the table id to the users/rooms table
    
  };

    //join a room------ there could later show private rooms and one has to conact the room person for auth to join a room 
  //-----------------------------------------------
  module.getJoinableRooms = function (userId) {

    //go to the rooms table and return all the rooms which have a status of public
    
  };

  return module;

};