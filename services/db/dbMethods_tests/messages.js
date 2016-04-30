var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');

var knex = require('knex');
var config = require('./../../../config.js');
var ENV = 'development';
var knex = knex(config.db[ENV]);

var messagesController = require('../dbMethods/messages.js')(knex);
var friendsController = require('../dbMethods/friends.js')(knex);

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
         //now make some friends
        return knex('friends')
        .insert([{
          friendor: users[0].u_id,
          friendee: users[1].u_id
         },{
          friendor: users[1].u_id,
          friendee: users[0].u_id
         },{
          friendor: users[3].u_id,
          friendee: users[1].u_id
         },{
          friendor: users[2].u_id,
          friendee:users[3].u_id
         }],'*');
      })
      .then(function (insertedFriends) {
        done();
      });
  });

  // ============= Teardown ============= \\
  after(function (done) {
    //remove friends
    return knex('friends').del()
    .then(function () {
      return knex('messages').del();
    })
    //remove users
    .then(function (delCount) {
      return knex('users').del();
    })
    .then(function (count) {
      done();
    });
  });

  describe('sendMessage', function () {


    it('should insert the sender and recipient and their message into the messages table', function (done) {

      var user = users[0];
      var recipient = users[1];
      return messagesController.sendMessage(user.u_id, recipient.username, "This is the first message!")
      .then(function (returnRow) {
        expect(returnRow[0].message).to.equal("This is the first message!");
        expect(returnRow[0].reciever_id).to.equal(recipient.u_id);
        expect(returnRow[0].has_been_read).to.equal(false);
        done();
      });

    });

    it('should insert a second sender and recipient and their message into the messages table', function (done) {

      var user = users[1];
      var recipient = users[0];
      return messagesController.sendMessage(user.u_id, recipient.username, "Pretty cool!")
      .then(function (returnRow) {
        expect(returnRow[1].message).to.equal("Pretty cool!");
        expect(returnRow[1].reciever_id).to.equal(recipient.u_id);
        expect(returnRow[1].has_been_read).to.equal(false);
        done();
      });

    });

    it('should not send a message to a user that the sender is not friends with', function (done) {

      var user = users[2];
      var recipient = users[0];
      return messagesController.sendMessage(user.u_id, recipient.username, "I am not friends with you")
      .then(function (returnRow) {
        console.log('return value send message', returnRow);
      })
      .catch(function (err) {
        expect(err.message).to.equal("You cannot send: TESTannaUser a request as you are not friends yet");
        done();
      });

    });

    it('should not send a message to a user that does not exist', function (done) {

      var user = users[1];
      return messagesController.sendMessage(user.u_id, "ickyThump", "I am not a user")
      .then(function (returnRow) {
        console.log('return value send message', returnRow);
      })
      .catch(function (err) {
        expect(err.message).to.equal("No user exists with the username: ickyThump");
        done();
      });

    });

  });

  describe('updateMessageStatus', function () {

    it('should update the has_been_read field in the messages table', function (done) {
      
      var user = users[1];
      messagesController.updateMessageStatus(user.u_id, "This is the first message!")
        .then(function (updatedRow) {
          expect(updatedRow.message).to.equal("This is the first message!");
          expect(updatedRow.has_been_read).to.equal(true);
          done();
        });

    });

    //only the user it was sent to can update the status of the message

  });


  describe('getUnreadMessages', function () {

    it('should get all usernames of friends that have sent messages that the user has not yet read by the user', function (done) {
      var user = users[0];
      messagesController.getUnreadMessages(user.u_id)
        .then(function (response) {
          expect(response).to.have.lengthOf(1);
          expect(response[0].username).to.equal("TESTkateUser");
          done();
        });
    });

  });

  describe('getMessagesFromFriend', function () {

    it('should all messages from conversation betwen you and a friend', function (done) {
      var user = users[1];
      var recipient = users[0];
      messagesController.getMessagesFromFriend(user.u_id, recipient.username)
        .then(function (response) {
          expect(response).to.have.lengthOf(2);
          expect(response[0].message).to.equal("This is the first message!");
          expect(response[0].sender_id).to.equal(recipient.u_id);
          done();
        });
    });

    it('should thow an error if the friend does not exist', function (done) {
      var user = users[1];
      var recipient = users[0];
      messagesController.getMessagesFromFriend(user.u_id, "redRackum")
        .then(function (response) {
          console.log('response', response);
        })
        .catch(function (err) {
          expect(err.message).to.equal("The username: redRackum does not exist");
          done();
        });
    });

  });


});
