
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

  getRooms: function (whoFor) {
    console.log('getting rooms! not yet');
    // requestHelper
    // .post('rooms/joined', { recipient: whoFor },jwt)
    // .end(function (err, response) {

    //   if (response.status === 200) {
    //     AppDispatcher.handleServerAction({
    //       actionType: "ADD_FRIEND",
    //       data: response.data
    //     });
    //   } else {
    //     console.log('err', err);
    //   }
    // });
  }

};


module.exports = roomActions;


 