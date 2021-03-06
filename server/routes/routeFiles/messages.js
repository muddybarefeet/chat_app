var express = require('express');
var router = express.Router();
var checkAuth = require('./../../../services/jwts/index.js').checkAuth;

module.exports = function (services) {

  router
    .param('username', function (req, res, next, username) {
      req.username = username;
      next();
    })
    .param('whoWith', function (req, res, next, whoWith) {
      req.whoWith = whoWith;
      next();
    });

  router.use(checkAuth);

  //send a message
  //-----------------------------------
  router.route('/send')
    .post(function (req, res) {

      var userId = req.__userId;
      var messageFor = req.body.to;
      var message = req.body.message;

      services.db.messages.sendMessage(userId, messageFor, message)
      .then(function(response) {
        console.log('message posted',response);
        res.json({
          data: response
        });
      })
      .catch(function(err){
        console.log('err', err);
        res.status(404).json({
            message: err.message
        });
      });

    });

  //mark a massage as read
  //-----------------------------------
  router.route('/read/:whoWith')
    .put(function (req, res) {
      var userId = req.__userId;
      var whoWith = req.whoWith;

      services.db.messages.updateMessageStatus(userId, whoWith)
      .then(function (response) {
        res.json({
          data: response
        });
      })
      .catch(function(err){
        console.log('err', err);
        res.status(404).json({
            message: err.message
        });
      });

    });

    //get messages from a certain friend
    //-----------------------------------
    router.route('/getall/:username')
      .get(function (req, res) {
        var userId = req.__userId;

        services.db.messages.getMessagesFromFriend(userId, req.username)
        .then(function (response) {
          res.json({
            data: response
          });
        })
        .catch(function(err){
          console.log('err', err);
          res.status(404).json({
              message: err.message
          });
        });

      });

  return router;

};
