var express = require('express');
var router = express.Router();
var checkAuth = require('./../../../services/jwts/index.js').checkAuth;

module.exports = function (services) {

  router
    .param('username', function (req, res, next, matchId) {
      req.username = username;
      next();
    });

  router.use(checkAuth);

  //send a message
  //-----------------------------------
  router.route('/send')
    .post(function (req, res) {

      console.log('in post to add friend',req.body);

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
  router.route('/read')
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


    // //get unread messages
    // //-----------------------------------
    // router.route('/getUnread')
    //   .get(function (req, res) {

    //     var userId = req.__userId;

    //     services.db.messages.getUnreadMessages(userId)
    //     .then(function (response) {
    //       res.json({
    //         data: response
    //       });
    //     })
    //     .catch(function(err){
    //       console.log('err', err);
    //       res.status(404).json({
    //           message: err.message
    //       });
    //     });

    //   });

    //get messages from a certain friend
    //-----------------------------------
    router.route('/getall/:username')
      .get(function (req, res) {
        console.log('in router', username);
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
