var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');

//extract this out if I can?
var knex = require('knex');
var config = require('./../../../config.js');
var ENV = 'development';
var knex = knex(config.db[ENV]);

var usersController = require('../dbMethods/users.js')(knex);

describe('Users Controller', function () {
  var users = [{
    username: 'TESTannaUser',
    email: 'TESTanna@anna',
    password: 'TESTanna'
  }, {
    username: 'TESTkateUser',
    email: 'TESTkate@kate',
    password: 'TESTkate'
  }, {
    username: 'TESTrohanUser',
    email: 'TESTrohan@rohan',
    password: 'TESTrohan'
  }];

  before(function (done) {
    done();
  });

  after(function (done) {
    console.log('removing the users');
    Promise.map(users, function (user) {
        return knex('users').where('email', user.email).del();
      })
      .then(function () {
        done();
      });
  });


  describe('signup', function () {

    it('should insert a user into the users table', function (done) {
      var user = users[0];
      console.log(user);
      usersController.signup(user.username, user.email, user.password)
        .then(function (insertedUser) {
          console.log('inserted user', insertedUser);
          expect(insertedUser.username).to.equal("TESTannaUser");
          done();
        });
    });


    it('should insert a second user into the users table', function (done) {
      var user = users[2];
      usersController.signup(user.username, user.email, user.password)
        .then(function (insertedUser) {
          expect(insertedUser.username).to.equal(user.username);
          done();
        });
    });

    it('should should not insert the same user into the table again', function (done) {
      var user = users[0];
      usersController.signup(user.username, user.email, user.password)
        .catch(function (err) {
          expect(err.message).to.equal("This user already exists in the users table");
          done();
        });
    });

  });


  describe('login', function () {

    it('should log an existing user in', function (done) {
      var user = users[0];
      usersController.login(user.email, user.password)
        .then(function (user) {
          expect(user.username).to.equal('TESTannaUser');
          done();
        });

    });

    it('should not log a not existing user in', function (done) {
      var user = users[2];
      usersController.login("Harry", "sally")
        .catch(function (err) {
          expect(err.message).to.equal('Your email and password does not exist in the database');
          done();
        });

    });

    it('should not log a user in with an incorrect password', function (done) {
      var user = users[2];
      usersController.login(user.email, "melon")
        .catch(function (err) {
          expect(err.message).to.equal('User not verified');
          done();
        });

    });

  });

});
