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
    //remove friends
    return knex('messages').del()
    //remove users
    .then(function (delCount) {
      return knex('users').del();
    })
    .then(function (count) {
      done();
    });
  });

  describe('createRoom', function () {

    //not going to check that the two users ar friends as this has been taken care of in the getFriends function
    it('should create a public room in the rooms table and insert the maker into the users_room table', function () {
      //userId, roomName, status, invited
      var user = users[0];
      var recipient = users[1];
      return roomsController.createRoom(user.u_id, "testRoom", "public", null)
      .then(function (returnRow) {
        console.log('room', returnRow);
        // expect(returnRow.message).to.equal("This is the first message!");
        // expect(returnRow.reciever_id).to.equal(recipient.u_id);
        // expect(returnRow.has_been_read).to.equal(false);
      });

    });

  });

  xdescribe('updateMessageStatus', function () {

    it('should update the has_been_read field in the messages table', function (done) {
      
      var user = users[1];
      var recipient = users[0];
      roomsController.updateMessageStatus(user.u_id, "This is the first message!")
        .then(function (updatedRow) {
          expect(updatedRow.message).to.equal("This is the first message!");
          expect(updatedRow.has_been_read).to.equal(true);
          done();
        });

    });

    it('should update the has_been_read field in the second message in the messages table', function (done) {
      
      var user = users[0];
      var recipient = users[1];
      roomsController.updateMessageStatus(user.u_id, "Pretty cool!")
        .then(function (updatedRow) {
          expect(updatedRow.message).to.equal("Pretty cool!");
          expect(updatedRow.has_been_read).to.equal(true);
          done();
        });

    });

  });


  xdescribe('getMessages', function () {

    it('should get all the users messages, written and recieved and return a hash of read and unread messages', function (done) {
      var user = users[0];
      roomsController.getMessages(user.u_id, "TESTkateUser")
        .then(function (response) {
          expect(response).to.have.lengthOf(2);
          done();
        });
    });

  });

});
