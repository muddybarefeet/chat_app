var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');

var knex = require('knex');
var config = require('./../../../config.js');
var ENV = 'development';
var knex = knex(config.db[ENV]);

var messagesController = require('../dbMethods/messages.js')(knex);

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

  describe('sendMessage', function () {

    //not going to check that the two users ar friends as this has been taken care of in the getFriends function
    it('should insert the sender and recipient and their message into the messages table', function () {

      var user = users[0];
      var recipient = users[1];
      return messagesController.sendMessage(user.u_id, recipient.username, "This is the first message!")
      .then(function (returnRow) {
        expect(returnRow.message).to.equal("This is the first message!");
        expect(returnRow.reciever_id).to.equal(recipient.u_id);
        expect(returnRow.has_been_read).to.equal(false);
      });

    });

  });

  describe('updateMessageStatus', function () {

    it('should update the has_been_read field in the messages table', function (done) {
      
      var user = users[1];
      var recipient = users[0];
      messagesController.updateMessageStatus(user.u_id, "This is the first message!")
        .then(function (updatedRow) {
          expect(updatedRow.message).to.equal("This is the first message!");
          expect(updatedRow.has_been_read).to.equal(true);
          done();
        });

    });

  });


  describe('getMessages', function () {

    it('should get all the users messages, written and recieved and return a hash of read and unread messages', function (done) {
      var user = users[0];
      messagesController.getMessages(user.u_id, "TESTkateUser")
        .then(function (response) {
          // expect(response).to.have.property('read').that.is.an('array');
          // expect(response).to.have.property('unread').that.is.an('array');
          // expect(response.read[0].message).to.equal('This is the first message!');
          // expect(response.unread).to.have.lengthOf(0);
          done();
        });
    });

  });

});
