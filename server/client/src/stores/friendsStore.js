
var AppDispatcher = require('./../dispatchers/appDispatcher.js');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = "change";

var _friendDetails = {
  friendsHash: [],
  notYetFriends: [],
  pendingRequestIn: [],
  pendingRequestOut: [],
  friendRequestSent: null
};

var friendsStore = Object.assign(new EventEmitter (), {
  
  getFriendData: function(){
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
  console.log('action in here');
  // if(action.actionType === "ADD_FRIEND") {
  //   console.log('action', action.data);
  //   //think about if want anything back to the user
  // }

  if (action.actionType === "GET_FRIENDS") {
    // split the db return into the correct bucket
    var options = ['friendsHash','notYetFriends','pendingRequestIn','pendingRequestOut'];
    options.forEach(function (option) {
      for ( var key in action.data[option] ) {
        console.log(option);
        _friendDetails[option].push(action.data[option][key]);
      }
    });

    console.log('new', _friendDetails);
    friendsStore.emitChange();
  }

  // if (action.actionType === "USER_LOGIN_ERROR") {

  // }

  // if (action.actionType === "USER_SIGNUP_ERROR") {
    
  // }


});


module.exports = friendsStore;

