
var express = require('express');
var router = express.Router();
var checkAuth = require('./../../../services/jwts/index.js').checkAuth;

module.exports = function (services) {

  router.use(checkAuth);

  //Post to make a connection with another person
  //-----------------------------------
  router.route('/add')
    .post(function (req, res) {

      console.log('in post to add friend');

      var userId = req.__userId;
      var requestFor = req.body.recipient;

      services.db.friends.makeConnection(userId, requestFor)
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
  router.route('/requestResponse')
    .post(function (req, res) {

      var userId = req.__userId;
      var toRespondTo = req.body.toRespond;
      var status = req.body.status;

      services.db.friends.confirmConnection(userId, toRespondTo, status)
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


    //get all people not friends 
    //-----------------------------------
    router.route('/showWhoCanFriend')
      .get(function (req, res) {

        var userId = req.__userId;

        services.db.friends.showWhoCanFriend(userId)
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
