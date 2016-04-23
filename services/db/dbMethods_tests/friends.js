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

  var friends = [{
    id: 1
  },{
    id: 2
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
    Promise.map(friends, function (friend) {
        return knex('friends')
        .where('f_id', friend.id)
        .del();
      })
      //remove users
      .then(function () {
        return Promise.map(users, function (user) {
          return knex('users').where('email', user.email).del();
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
      friendsController.makeConnection(user.u_id, friendee.username)
        .then(function (returnRow) {
          expect(returnRow.friendor).to.equal(user.u_id);
          done();
        });

    });

  });

  describe('confirmRequest', function () {

    it('should instert a new row into the friends table to confirm the previous friend request', function (done) {
      
      //could this be a better test?
      var user = users[1];
      var recipient = users[0];
      friendsController.confirmRequest(user.u_id, recipient.username)
        .then(function (insetedRow) {
          expect(insetedRow.f_id).to.equal(2);
          expect(insetedRow.friendor).to.equal(2);
          expect(insetedRow.friendee).to.equal(1);
          done();
        });

    });

  });


  describe('getFriends', function () {

    it('should return a hash of the users friends, pending requests made and other people\'s friend requests to them', function (done) {
      var user = users[1];
      friendsController.getFriends(user.u_id)
        .then(function (response) {
          expect(response).to.have.property('friends').that.is.an('array');
          expect(response).to.have.property('pending').that.is.an('array');
          expect(response).to.have.property('pendingIn').that.is.an('array');
          expect(response).to.have.property('pendingIn').that.is.an('array');
          done();
        });
    });

  });

});
