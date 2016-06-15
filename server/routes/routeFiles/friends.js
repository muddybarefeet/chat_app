
var express = require('express');
var router = express.Router();
var checkAuth = require('./../../../services/jwts/index.js').checkAuth;

module.exports = function (services) {

  router
    .param('searchName', function (req, res, next, searchName) {
      req.searchName = searchName;
      console.log('search name', searchName);
      next();
    });

  router.use(checkAuth);

  //Post to make a connection with another person
  //-----------------------------------
  router.route('/add')
    .post(function (req, res) {

      var userId = req.__userId;
      var requestFor = req.body.recipient;

      services.db.friends.sendFriendReqest(userId, requestFor)
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

  //Confirm that you want to make a new connection with a request sent to you
  //-----------------------------------
  router.route('/confirm')
    .post(function (req, res) {
      var userId = req.__userId;
      var toRespondTo = req.body.toRespond;

      services.db.friends.confirmRequest(userId, toRespondTo)
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

  //Reject friend connection sent to you
  //-----------------------------------
  router.route('/reject')
    .post(function (req, res) {
      var userId = req.__userId;
      var toRespondTo = req.body.toRespond;

      services.db.friends.rejectRequest(userId, toRespondTo)
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


  //get all friends
  //-----------------------------------
  router.route('/get')
    .get(function (req, res) {

      var userId = req.__userId;

      services.db.friends.getFriends(userId)
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

  //get all friends
  //-----------------------------------
  router.route('/messages')
    .get(function (req, res) {

      var userId = req.__userId;

      services.db.friends.messages(userId, friendUsername)
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

  //search and return all friends that match the current input
  //-----------------------------------
  router.route('/search/:searchName')
    .get(function (req, res) {

      var userId = req.__userId;

      services.db.friends.search(userId, req.searchName)
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
