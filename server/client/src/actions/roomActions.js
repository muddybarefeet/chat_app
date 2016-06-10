
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
  }

};


module.exports = roomActions;


 