
var express = require('express');
var router = express.Router();

module.exports = function (services) {

  //Post to make a connection with another person
  //-----------------------------------
  router.route('/makeConnection')
    .post(function (req, res) {
      //want to pass to the database:
      //user to make connection and who connect to 
      
      services.db.friends.makeConnection(/*userRequested, requestFor*/)
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
  router.route('/confirmConnection')
    .post(function (req, res) {
      
      services.db.friends.confirmConnection(/*userConfirmed, userConfirmedTo, accept/reject*/)
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
