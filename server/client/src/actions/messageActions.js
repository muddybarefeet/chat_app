
var AppDispatcher = require('./../dispatchers/appDispatcher.js');
var requestHelper = require('./requestHelper.js');

var jwt = require('../constants.js').jwt;

var messageActions = {

  seeMessageHistory: function (username) {
    requestHelper
    .get('messages/getall/' + username, jwt)
    .end(function (err, response) {
      console.log('friend data got',response.body.data);
      AppDispatcher.handleClientAction({
        actionType: "GET_FRIENDS",
        data: response.body.data
      });
    });
  }


};


module.exports = messageActions;


 