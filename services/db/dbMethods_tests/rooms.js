var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');

var knex = require('knex');
var config = require('./../../../config.js');
var ENV = 'development';
var knex = knex(config.db[ENV]);

var roomsController = require('../dbMethods/rooms.js')(knex);

describe('Friends Controller', function () {
  
  var users = [{
    username: 'TESTannaUser',
    password: 'TESTanna',
    email: 'TESTanna@anna'
  }, {
    username: 'TESTkateUser',
    password: 'TESTkate',
    email: 'TESTkate@kate'
  }, {
    username: 'TESTrohanUser',
    password: 'TESTrohan',
    email: 'TESTrohan@rohan'
  }, {
    username: 'TESTruanUser',
    password: 'TESTruan',
    email: 'TESTruan@rohan'
  }];


  // ============= Setup ============= \\
  before(function (done) {
   //insert users into DB
   knex('users').insert(users, '*')
     .then(function (response) {
      //re-set the users table to the db response
       users = response;
       done();
     });
  });

  // ============= Teardown ============= \\
  after(function (done) {
    return knex('rooms_messages').del()
    .then(function () {
      return knex('users_rooms').del();
    })
    .then(function () {
      return knex('rooms').del();
    })
    .then(function (delCount) {
      return knex('users').del();
    })
    .then(function (count) {
      done();
    });
  });

  describe('createRoom', function () {

    it('should create a public room in the rooms table and insert the maker into the users_room table', function (done) {
      var user = users[0];
      return roomsController.createRoom(user.u_id, "testRoom", "public")
      .then(function (returnRow) {
        expect(returnRow[0].accepted).to.equal(true);
        return knex.select()
        .from('rooms')
        .where('name', "testRoom");
      })
      .then(function (usersReturn) {
        expect(usersReturn[0].type).to.equal("public");
        expect(usersReturn[0].creator).to.equal(user.u_id);
        done();
      });

    });

    it('should create a PRIVATE room in the rooms table and insert the maker into the users_room table', function (done) {
      //userId, roomName, status, invited
      var user = users[3];
      return roomsController.createRoom(user.u_id, "testRoom2", "private")
      .then(function (returnRow) {
        expect(returnRow[0].accepted).to.equal(true);
        return knex.select()
        .from('rooms')
        .where('name', "testRoom2");
      })
      .then(function (usersReturn) {
        expect(usersReturn[0].type).to.equal("private");
        expect(usersReturn[0].creator).to.equal(user.u_id);
        done();
      });

    });

    it('should create a second public room in the rooms table and insert the maker into the users_room table', function (done) {
      //userId, roomName, status, invited
      var user = users[3];
      return roomsController.createRoom(user.u_id, "testRoom3", "public")
      .then(function (returnRow) {
        expect(returnRow[0].accepted).to.equal(true);
        return knex.select()
        .from('rooms')
        .where('name', "testRoom3");
      })
      .then(function (usersReturn) {
        expect(usersReturn[0].type).to.equal("public");
        expect(usersReturn[0].creator).to.equal(user.u_id);
        done();
      });

    });

  });

  describe('inviteUsers', function () {

    it('should invite users to a room', function (done) {
      //have for either public/private rooms
      var user = users[0];
      roomsController.inviteUsers(user.u_id, "testRoom", ['TESTkateUser','TESTrohanUser'])
        .then(function (returnRow) {
          expect(returnRow).to.have.lengthOf(2);
          expect(returnRow[0].accepted).to.equal(false); //false as invited and not yet accepted invite
          done();
        });

    });

    it('should not invite users to a room that have not already been invited', function (done) {
      //have for either public/private rooms
      var user = users[0];
      roomsController.inviteUsers(user.u_id, "testRoom", ['TESTrohanUser'])
        .then(function (returnRow) {
        })
        .catch(function (err) {
          expect(err.message).to.equal("User has already been invited");
          done();
        });
    });

    //not inset room that does not exist
    //not insert user not exist

  });


  describe('joinRoom', function () {

    //not testing users joining rooms that they are already part of as this will not be possible on the front end 
    it('should add a user to a room', function (done) {
      var user = users[3];
      roomsController.joinRoom(user.u_id, "testRoom")
        .then(function (response) {
          expect(response).to.have.lengthOf(1);
          expect(response[0].userId).to.equal(user.u_id);
          done();
        });
    });

    it('should update the accepted status of invited users in the users_rooms table', function (done) {
      var user = users[2];
      roomsController.joinRoom(user.u_id, "testRoom")
        .then(function (response) {
          expect(response).to.have.lengthOf(1);
          expect(response[0].accepted).to.equal(true);
          expect(response[0].userId).to.equal(user.u_id);
          done();
        });
    });

    //not inset room that does not exist
    //not insert user that is not in the users table

  });

  describe('getPeningRequests', function () {

    it('should get all pending requests that a user has not accepted', function (done) {
      var user = users[1];

      roomsController.getPeningRequests(user.u_id)
        .then(function (response) {
          expect(response).to.have.lengthOf(1);
          expect(response[0].creator).to.not.equal(user.u_id);
          expect(response[0].name).to.equal("testRoom");
          done();
        });
    });

    //user should exist

  });

  describe('notJoinedYet', function () {

    it('should show all the public rooms that one has not yet joined yet', function (done) {
      var user = users[0];
      roomsController.notJoinedYet(user.u_id)
        .then(function (response) {
          expect(response).to.have.lengthOf(1);
          expect(response[0].type).to.equal("public");
          done();
        });
    });

    //it should not show private rooms


  });

  describe('seeRoomsIn', function () {

    it('should return all the rooms that you are part of', function (done) {
      var user = users[3];
      roomsController.seeRoomsIn(user.u_id)
        .then(function (response) {
          expect(response).to.have.lengthOf(3);
          expect(response[0].name).to.equal("testRoom");
          done();
        });
    });

  });

  describe('sendMessage', function () {

    it('should post a message in a room', function (done) {
      var user = users[3];
      roomsController.sendMessage(user.u_id, "testRoom2", "This is the first message in testRoom2!")
        .then(function (response) {
          expect(response).to.have.lengthOf(1);
          expect(response[0].sender).to.equal(user.u_id);
          expect(response[0].message).to.equal("This is the first message in testRoom2!");
          done();
        });
    });
    //not insert room that does not exist
    //make second test to show the user is part of this room/not insert messgae for user not in the room

  });

  describe('getMessages', function () {
    //-----------------------------------------------------check one has joined this room!!
    it('should get all the messages in a certain room', function (done) {
      var user = users[3];
      roomsController.getMessages(user.u_id, "testRoom2")
        .then(function (response) {
          expect(response).to.have.lengthOf(1);
          expect(response[0].message).to.equal("This is the first message in testRoom2!");
          done();
        });
    });

    it('should return an empty array for rooms that have no messages', function (done) {
      var user = users[0];
      roomsController.getMessages(user.u_id, "testRoom")
        .then(function (response) {
          expect(response).to.have.lengthOf(0);
          done();
        });
    });

    //not insert room that does not exist
    //make third test to show the user is part of this room and so can get messages from it

  });

  describe('leaveRooms', function () {

    it('should remove the user from a room', function (done) {
      var user = users[3];
      roomsController.leaveRooms(user.u_id, "testRoom")
        .then(function (response) {
          console.log('things', response);
          expect(response).to.equal(true);
          done();
        });
    });

    it('should not accept a room that does not exist', function (done) {
      var user = users[3];
      roomsController.leaveRooms(user.u_id, "gobldyGookRoom")
        .then(function (response) {
        })
        .catch(function (err) {
          expect(err.message).to.equal("Room: gobldyGookRoom does not exist");
          done();
        });
    });


  });


});
