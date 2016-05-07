

// fnHash.getMessagesFromFriend = function (userId, otherUsername)


var express = require('express');
var router = express.Router();
var checkAuth = require('./../../../services/jwts/index.js').checkAuth;

module.exports = function (services) {

  router.use(checkAuth);

  //send a message
  //-----------------------------------
  router.route('/sendMessage')
    .post(function (req, res) {

      console.log('in post to add friend');

      var userId = req.__userId;
      var requestFor = req.body.recipient;

      services.db.messages.sendMessage(userId, recipient, message)
      .then(function(response) {
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
  router.route('/readMessage')
    .put(function (req, res) {
      var userId = req.__userId;
      var toRespondTo = req.body.toRespond;

      services.db.messages.updateMessageStatus(userId, message)
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


    //get unread messages
    //-----------------------------------
    router.route('/get')
      .get(function (req, res) {

        var userId = req.__userId;

        services.db.messages.getUnreadMessages(userId)
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
    router.route('/get')
      .get(function (req, res) {

        var userId = req.__userId;

        services.db.messages.getMessagesFromFriend(userId, friendsUsername)
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
