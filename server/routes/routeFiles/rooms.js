var express = require('express');
var router = express.Router();
var checkAuth = require('./../../../services/jwts/index.js').checkAuth;

module.exports = function (services) {

  router.use(checkAuth);

  //make a room
  //-----------------------------------
  router.route('/create')
    .post(function (req, res) {

      var userId = req.__userId;
      var roomName = req.body.name;
      var status = req.body.status;
      console.log('in post to add friend route', roomName, status);

      services.db.rooms.createRoom(userId, roomName, status)
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

  //invite users to a room
  //-----------------------------------
  router.route('/invite')
    .post(function (req, res) {
      var userId = req.__userId;
      var toRespondTo = req.body.toRespond;

      services.db.rooms.inviteUsers(userId, roomName, inviteeArr)
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

  //join a room
  //-----------------------------------
  router.route('/join')
    .put(function (req, res) {

      var userId = req.__userId;

      services.db.rooms.joinRoom(userId, roomName)
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

  //get pending room resquests
  //-----------------------------------
  router.route('/pending')
    .get(function (req, res) {

      var userId = req.__userId;

      services.db.rooms.getPeningRequests(userId)
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
  router.route('/notJoined')
    .get(function (req, res) {

      var userId = req.__userId;

      services.db.rooms.notJoinedYet(userId)
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

  // get the rooms that joined rooms in
  //-----------------------------------
  router.route('/joined')
    .get(function (req, res) {

      var userId = req.__userId;

      services.db.rooms.seeRoomsIn(userId)
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

  //send message to a room
  //-----------------------
  router.route('/send')
    .post(function (req, res) {

      var userId = req.__userId;
      var roomName = req.body.roomName;
      var message = req.body.message;

      services.db.rooms.sendMessage(userId, roomName, message)
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


  //leave a room
  //---------------
  router.route('/notJoined')
    .post(function (req, res) {

      var userId = req.__userId;
      var roomName = req.body.roomName;

      services.db.rooms.leaveRooms(userId, roomName)
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
