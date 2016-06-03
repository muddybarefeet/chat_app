
var AppDispatcher = require('./../dispatchers/appDispatcher.js');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = "change";

var _messageDetails = {
  friends: [],
  notYetFriends: [],
  pendingRequestIn: [],
  pendingRequestOut: [],
  friendRequestSent: null
};

var messagesStore = Object.assign(new EventEmitter (), {
  
  getFriendData: function () {
    return _friendDetails;
  },

  emitChange: function (){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    this.addListener(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AppDispatcher.register( function (payload){ //'subscribes' to the dispatcher. Store wants to know if it does anything. Payload 
  var action = payload.action;//payload is the object of data coming from dispactcher //action is the object passed from the actions file


  // if (action.actionType === "GET_MESSAGES") {

  //   messagesStore.emitChange();
  // }

  // if (action.actionType === "SEND_MESSAGE") {

  // }

  // if (action.actionType === "NEW_MESSAGES") {
    
  // }


});


module.exports = messagesStore;

