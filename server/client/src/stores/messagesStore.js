
var AppDispatcher = require('./../dispatchers/appDispatcher.js');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = "change";

var _messageDetails = {
  messages: []
};

var messagesStore = Object.assign(new EventEmitter (), {
  
  getMessageData: function () {
    return _messageDetails;
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


  if (action.actionType === "GET_MESSAGES" || action.actionType ===  "UPDATED_READ" || action.actionType === "SENT_MESSAGE") {
    _messageDetails.messages = action.data;
    messagesStore.emitChange();
  }

  // if (action.actionType === "NEW_MESSAGES") {
    
  // }

});


module.exports = messagesStore;

