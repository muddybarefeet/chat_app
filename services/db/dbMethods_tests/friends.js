var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');

var knex = require('knex');
var config = require('./../../../config.js');
var ENV = 'development';
var knex = knex(config.db[ENV]);

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
       done();
     });
  });

  // ============= Teardown ============= \\
  after(function (done) {
    //remove friends
    return knex('friends').del()
    //remove users
    .then(function (delCount) {
      return knex('users').del();
    })
    .then(function (count) {
      done();
    });
  });

  describe('sendFriendReqest', function () {

    it('should insert a user id into the friends table as the friendor', function () {

      var user = users[0];
      var friendee = users[1];
      return friendsController.sendFriendReqest(user.u_id, friendee.username)
        .then(function (returnRow) {
          return expect(returnRow.friendor).to.equal(user.u_id);
        });

    });

    it('should insert a second user id into the friends table as the friendor', function (done) {

      var user = users[0];
      var friendee = users[3];
      friendsController.sendFriendReqest(user.u_id, friendee.username)
        .then(function (returnRow) {
          expect(returnRow.friendor).to.equal(user.u_id);
          return knex.select().from('users').orderBy('u_id', 'asc');
        })
        .then(function (usersArray) {
          users = usersArray;
          done();
        });
    });


  });

  describe('confirmRequest', function () {

    it('should instert a new row into the friends table to confirm the previous friend request', function (done) {
      
      var user = users[1];
      var recipient = users[0];
      friendsController.confirmRequest(user.u_id, recipient.username)
        .then(function (insetedRow) {
          expect(insetedRow.friendor).to.equal(users[1].u_id);
          expect(insetedRow.friendee).to.equal(users[0].u_id);
          done();
        });

    });

    it('should NOT confirm request with user that does not exist', function (done) {
      
      var user = users[1];
      friendsController.confirmRequest(user.u_id, "berryBot")
        .then(function (response) {
          expect(response).to.equal(null);
        })
        .catch(function (err) {
          expect(err.message).to.equal("The user: berryBot does not exist");
          done();
        });

    });

  });

  describe('getFriends', function () {

    it('should return a hash of the users friends, pending requests made and other people\'s friend requests to them', function (done) {
      var user = users[0];
      friendsController.getFriends(user.u_id)
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
