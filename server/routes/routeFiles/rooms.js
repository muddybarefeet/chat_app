var express = require('express');
var router = express.Router();
var checkAuth = require('./../../../services/jwts/index.js').checkAuth;

module.exports = function (services) {

  router.use(checkAuth);

  //make a room
  //-----------------------------------
  router.route('/create')
    .post(function (req, res) {

      console.log('in post to add friend');

      var userId = req.__userId;
      var requestFor = req.body.recipient;

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
  router.route('/read')
    .put(function (req, res) {
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

  //get messages from a certain friend
  //-----------------------------------
  router.route('/send')
    .get(function (req, res) {

      var userId = req.__userId;

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

  //get messages from a certain friend
  //-----------------------------------
  router.route('/getMessages')
    .get(function (req, res) {

      var userId = req.__userId;

      services.db.rooms.notJoinedYet(userId, roomName)
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
