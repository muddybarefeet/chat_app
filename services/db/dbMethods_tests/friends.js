var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');

//want to take this out if I can?
var knex = require('knex');
var config = require('./../../../config.js');
var ENV = 'development';
var knex = knex(config.db[ENV]);

var friendsController = require('../dbMethods/friends.js')(knex);

describe('Friends Controller', function () {
  
  var users = [{
    username: 'TESTannaUser',
    name: 'TESTanna',
    email: 'TESTanna@anna'
  }, {
    username: 'TESTkateUser',
    name: 'TESTkate',
    email: 'TESTkate@kate'
  }, {
    username: 'TESTrohanUser',
    name: 'TESTrohan',
    email: 'TESTrohan@rohan'
  }, {
    username: 'TESTruanUser',
    name: 'TESTruan',
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
    //remove matches
    Promise.map(friends, function (friend) {
        return knex('friends')
          .where('friendor', users[0].u_id)
          .orWhere('friendee', users[1].u_id)
          .del();
      })
      //remove users
      .then(function () {
        return Promise.map(users, function (user) {
          return knex('users').where('u_id', user.u_id).del();
        });
      })
      .then(function () {
        done();
      });
  });

  describe('makeConnection', function () {

    it('should insert a the user id into the friends table as the friendor', function (done) {

      var user = users[0];
      var friendee = users[1];
      usersController.makeConnection(user.u_id, friendee.u_id)
        .then(function (returnRow) {
          expect(returnRow.friendor).to.equal(user.u_id);
          done();
        });

    });

  });

  describe('confirmRequest', function () {

    it('should instert a new rown into the friends table to confirm the previous friend request', function (done) {
      
      //could this be a better test?
      var user = users[1];
      var recipient = users[0];
      usersController.confirmRequest(user.u_id, recipient.u_id)
        .then(function (numOfAffectedRows) {
          expect(numOfAffectedRows).to.equal(1);
          done();
        });

    });

  });


  describe('getFriends', function () {

    it('should return a hash of the users friends, pending requests made and other people\'s friend requests to them', function (done) {
      var user = users[1];
      usersController.getFriends(user.u_id)
        .then(function (response) {
          expect(response).to.have.property('friends').that.is.an('array');
          expect(response).to.have.property('pending').that.is.an('array');
          expect(response).to.have.property('pendingIn').that.is.an('array');
          done();
        });
    });

  });

  describe('showWhoCanFriend', function () {

    it('should return an array of all the users that the user is not currently friends with', function (done) {
      
      var user = users[1];
      usersController.showWhoCanFriend(user.u_id)
        .then(function (arrayUserInformation) {
          expect(arrayUserInformation).to.have.length.above(0);
          done();
        });

    });

  });

});
