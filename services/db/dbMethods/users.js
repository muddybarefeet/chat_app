var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var encode = require('./../../jwts/index.js').encode;

module.exports = function (knex) {

  var module = {};

//Takes login info and checks password
//-------------------------------------
  module.login = function (email, password) {
    var id;
    var user_name;
    return knex('users').where('email', email)
    .then(function (data) {
      if (data.length > 0) {
        id = data[0].u_id;
        userEmail = data[0].email;
        user_name = data[0].username;
        return bcrypt.compareAsync(password, data[0].password);
      } else {
        throw new Error("Your email and password does not exist in the database");
      }
    })
    .then(function (userVerified) {
      //userVerified returns true/false
      if (userVerified) {
        //return the user a jwt plus username
        var obj = {};
        obj.jwt = encode({id: id, exp: current});
        obj.username = user_name;
        return obj;
      } else {
        throw new Error("User not verified");
      }
    });

  };


//save new user data to the db
//-------------------------------------
  module.signup = function (username, email, password) {

    return bcrypt.genSaltAsync(10)
    .then(function(salt) {
      return bcrypt.hashAsync(password, salt);
    })
    .then(function(hash) {
      return knex('users')
      .insert({
        username: username,
        password: hash,
        email: email
      }, '*');
    })
    .then(function (insertedUser) {
      //make an encoded jwt to send back to client plus username
      var obj = {};
      obj.jwt = encode({id: insertedUser[0].u_id});
      obj.username = insertedUser[0].username;
      return obj;
    })
    .catch(function (err) {
      var error = err.message;
      var regex = new RegExp("duplicate key value violates unique constraint");
      if (regex.test(error) ) {
        throw new Error("This user already exists in the users table");
      } else {
        throw err;
      }

    });
  };


  return module;

};