
var AppDispatcher = require('./../dispatchers/appDispatcher.js');
var requestHelper = require('./requestHelper.js');

var jwt = require('../constants.js').jwt;

var roomActions = {

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
  },

  makeRoom: function (friendToConfirm) {

    requestHelper
    .post('rooms/create', { toRespond: friendToConfirm }, jwt)
    .end(function (err, response) {
      console.log('response from db on confiming/reject friend a friend', response);

    });

  }

};


module.exports = roomActions;


 