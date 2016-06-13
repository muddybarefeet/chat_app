
var AppDispatcher = require('./../dispatchers/appDispatcher.js');
var requestHelper = require('./requestHelper.js');

var jwt = require('../constants.js').jwt;

var roomActions = {

  makeRoom: function (roomName,roomStatus) {

    requestHelper
    .post('rooms/create', { name: roomName, status: roomStatus }, jwt)
    .end(function (err, response) {
      console.log('response from db on confiming/reject friend a friend', response);
      AppDispatcher.handleServerAction({
        actionType: "MAKE_ROOM",
        data: response.body.data
      });

    });

  },

  getRooms: function () {
    console.log('in get room action');
    requestHelper
    .get('rooms/joined', jwt)
    .end(function (err, response) {
      if (response.status === 200) {
        AppDispatcher.handleServerAction({
          actionType: "GET_ROOMS",
          data: response.body.data
        });
      } else {
        console.log('err', err);
      }
    });
  },

  sendMessage: function (name,message) {
    console.log('in get send message action');
    requestHelper
    .post('rooms/send', {roomName:name, message:message}, jwt)
    .end(function (err, response) {
      if (response.status === 200) {
        AppDispatcher.handleServerAction({
          actionType: "SEND_MESSAGE",
          data: response.body.data
        });
      } else {
        console.log('err', err);
      }
    });
  },

  getMessages: function (roomName) {
    requestHelper
    .get('rooms/messages/'+roomName, jwt)
    .end(function (err, response) {
      console.log('action ', response);
      if (response.status === 200) {
        AppDispatcher.handleServerAction({
          actionType: "GET_MESSAGES",
          data: response.body.data
        });
      } else {
        console.log('err', err);
      }
    });
  },

  getJoinable: function () {
    requestHelper
    .get('rooms/joinable', jwt)
    .end(function (err, response) {
      if (response.status === 200) {
        AppDispatcher.handleServerAction({
          actionType: "GET_JOINABLE",
          data: response.body.data
        });
      } else {
        console.log('err', err);
      }
    });
  }

};


module.exports = roomActions;


 