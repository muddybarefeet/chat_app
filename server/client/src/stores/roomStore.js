
var AppDispatcher = require('./../dispatchers/appDispatcher.js');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = "change";

var _roomDetails = {
  rooms: []
};

var roomStore = Object.assign(new EventEmitter (), {
  
  getRoomData: function () {
    return _roomDetails;
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
  // if(action.actionType === "ADD_FRIEND") {
  //   console.log('action', action.data);
  //   //think about if want anything back to the user
  // }

  if (action.actionType === "GET_ROOMS") {
    // split the db return into the correct bucket
    console.log('in get rooms store',action.data);

    roomStore.emitChange();
  }

  // if (action.actionType === "USER_LOGIN_ERROR") {

  // }

  // if (action.actionType === "USER_SIGNUP_ERROR") {
    
  // }


});


module.exports = roomStore;

