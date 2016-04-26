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
    return knex('users_rooms').del()
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

    //not going to check that the two users ar friends as this has been taken care of in the getFriends function
    it('should create a public room in the rooms table and insert the maker into the users_room table', function () {
      //userId, roomName, status, invited
      var user = users[0];
      return roomsController.createRoom(user.u_id, "testRoom", "public")
      .then(function (returnRow) {
        expect(returnRow[0].accepted).to.equal(true);
        return knex.select()
        .from('rooms')
        .where('name', "testRoom");
      })
      .then(function (usersReturn) {
        console.log(usersReturn);
        expect(usersReturn[0].type).to.equal("public");
        expect(usersReturn[0].creator).to.equal(user.u_id);
        done();
      });

    });

  });

  describe('inviteUsers', function () {

    it('should invite users to a room', function (done) {
      //have for either public/private rooms
      var user = users[1];
      roomsController.inviteUsers(user.u_id, "testRoom", ['TESTannaUser','TESTrohanUser','TESTruanUser'])
        .then(function (returnRow) {
          console.log('returning', returnRow);
          expect(returnRow).to.have.lengthOf(3);
          expect(returnRow.accepted).to.equal(false); //false as invited and not yet accepted invite
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
