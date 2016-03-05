
var AppDispatcher = require('./../dispatchers/appDispatcher.js');
var requestHelper = require('./requestHelper.js');

var jwt = require('../constants.js').jwt;

var friendsActions = {

  addFriend: function (whoFor) {

    requestHelper
    .post('friends/add', { recipient: whoFor },jwt)
    .end(function (err, response) {

      if (response.status === 200) {
        AppDispatcher.handleServerAction({
          actionType: "ADD_FRIEND",
          data: response.data
        });
      } else {
        console.log('err', err);
      }
    });
  },

  requestResponse: function (friendToConfirm, status) {

    requestHelper
    .post('friends/requestResponse', { toRespondTo: friendToConfirm, status: status }, jwt)
    .end(function (err, response) {
      console.log('response from db on confiming/reject friend a friend', response);

    });

  },

  getFriends: function () {
    console.log('geting friends')
    requestHelper
    .get('friends/get', jwt)
    .end(function (err, response) {
      console.log('response getting friends', response);

    });

  },

  showWhoCanFriend: function () {

    requestHelper
    .get('friends/showWhoCanFriend', jwt)
    .end(function (err, response) {
      console.log('response show who can be friended', response);

    });

  }

};


module.exports = friendsActions;


 