
var AppDispatcher = require('./../dispatchers/appDispatcher.js');
var requestHelper = require('./requestHelper.js');

var jwt = require('../constants.js').jwt;

var messageActions = {

  getMessages: function (username) {
    requestHelper
    .get('messages/getall/' + username, jwt)
    .end(function (err, response) {
      AppDispatcher.handleClientAction({
        actionType: "GET_MESSAGES",
        data: response.body.data
      });
    });
  },

  sendMessage: function (whoFor,message) {

    requestHelper
    .post('messages/send', { to: whoFor, message: message }, jwt)
    .end(function (err, response) {
      console.log('message data got',response.body.data);
      AppDispatcher.handleClientAction({
        actionType: "SENT_MESSAGE",
        data: response.body.data
      });
    });

  }


};


module.exports = messageActions;


 