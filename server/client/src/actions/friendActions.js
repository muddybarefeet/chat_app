
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

  confirmRequest: function (friendToConfirm) {

    requestHelper
    .post('friends/confirm', { toRespond: friendToConfirm }, jwt)
    .end(function (err, response) {
      console.log('response from db on confiming/reject friend a friend', response);

    });

  },

  rejectRequest: function (friendToConfirm) {

    requestHelper
    .post('friends/reject', { toRespond: friendToConfirm }, jwt)
    .end(function (err, response) {
      console.log('response from db on confiming/reject friend a friend', response);

    });

  },

  getFriends: function () {
    requestHelper
    .get('friends/get', jwt)
    .end(function (err, response) {
      console.log('friend data got',response.body.data);
      AppDispatcher.handleClientAction({
        actionType: "GET_FRIENDS",
        data: response.body.data
      });
    });

  },

  seeMessageHistory: function (username) {
    requestHelper
    .get('messages/getall', jwt)
    .end(function (err, response) {
      console.log('friend data got',response.body.data);
      AppDispatcher.handleClientAction({
        actionType: "GET_FRIENDS",
        data: response.body.data
      });
    });
  },

  search: function (search) {
    console.log('friend actions');
    requestHelper
    .get('friends/search/' + search, jwt)
    .end(function (err, response) {
      console.log('joining', response);
      if (response.status === 200) {
        AppDispatcher.handleServerAction({
          actionType: "SEARCH_FRIENDS",
          data: response.body.data
        });
      } else {
        console.log('err', err);
      }
    });
  }

};


module.exports = friendsActions;


 