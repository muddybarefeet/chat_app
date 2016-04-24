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
        console.log('returning', returnRow);
        expect(returnRow.message).to.equal("This is the first message!");
        expect(returnRow.reciever_id).to.equal(recipient.u_id);
        expect(returnRow.has_been_read).to.equal(false);
      });

    });

  });

  xdescribe('confirmRequest', function () {

    it('should instert a new row into the friends table to confirm the previous friend request', function (done) {
      
      var user = users[1];
      var recipient = users[0];
      messagesController.confirmRequest(user.u_id, recipient.username)
        .then(function (insetedRow) {
          expect(insetedRow.friendor).to.equal(users[1].u_id);
          expect(insetedRow.friendee).to.equal(users[0].u_id);
          expect(insetedRow.friendee).to.equal(users[0].u_id);
          
          done();
        });

    });

  });


  xdescribe('getFriends', function () {

    it('should return a hash of the users friends, pending requests made and other people\'s friend requests to them', function (done) {
      var user = users[0];
      messagesController.getFriends(user.u_id)
        .then(function (response) {
          expect(response).to.have.property('friendsHash').that.is.an('object');
          expect(response).to.have.property('pendingResquestIn').that.is.an('object');
          expect(response).to.have.property('pendingResquestOut').that.is.an('object');
          expect(response).to.have.property('notYetFriends').that.is.an('object');
          expect(response.friendsHash[users[1].u_id].username).to.equal('TESTkateUser');
          expect(response.notYetFriends[users[2].u_id].username).to.equal('TESTrohanUser');
          done();
        });
    });

  });

});
