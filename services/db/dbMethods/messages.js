//this is for person to person messaging

module.exports = function (knex, helpers) {

  var fnHash = {};

  //to click on a friend and to send them a message
  fnHash.sendMessage = function (userId, recipient, message) {
    var recipientId;
    console.log('in sending message');
    return knex.select('u_id')
      .from('users')
      .where('username', recipient)
    .then(function (arrayOfId) {
      if (arrayOfId.length !== 1) {
        throw new Error("No user exists with the username: "+recipient);
      }
      recipientId = arrayOfId[0].u_id;
      //no check that the sender and recipient are friends
      return knex.select()
      .from('friends')
      .where(function () {
        this.where('friendor', userId)
        .andWhere('friendee', recipientId);
      })
      .orWhere(function () {
        this.where('friendor', recipientId)
        .andWhere('friendee', userId);
      });
    })
    .then(function (selectedFriendRows) {
      //if this does not contain 2 then err
      if (selectedFriendRows.length !== 2) {
        throw new Error("You cannot send: "+ recipient +" a request as you are not friends yet");
      }
      //else insert the message into the messages table
      return knex('messages')
      .insert({
        sender_id: userId,
        reciever_id: recipientId,
        message: message,
        has_been_read: false
      },'*');
    })
    .then(function (insertedMessageRow) {
      return helpers.getMessages(userId, recipient);
    })
    .catch(function (err) {
      console.log('err in send message', err);
      throw err;
    });

  };

  //function triggered on a user reading a message to set has_been_read to true
  fnHash.updateMessageStatus = function (userId, whoWith) {
    var friendId;
    return knex
    .select('u_id')
    .from('users')
    .where('username',whoWith)
    .then(function (uIdArr) {
      friendId = uIdArr[0].u_id;
      //update the has_been_read cell in the messages table to true when the message was snet to the user
      return knex('messages')
      .where('reciever_id', userId)
      .andWhere('sender_id', friendId)
      .update({
        has_been_read: true
      }, '*');
    })
    .then(function (newRow) {
      // return all the messages with updated status
      return helpers.getMessages(userId, whoWith);
    })
    .catch(function (err) {
      console.log('err updating read message status');
      throw err;
    });
  };

  //to recieve all messages sent to the client from other users
  fnHash.getUnreadMessages = function (userId) {
    //get all messages the user is in where the messages have not been read
    return helpers.getUnreadMessages(userId);
  };

  //get specific conversation between you and a user
  fnHash.getMessagesFromFriend = function (userId, otherUsername) {
    // call the function from the helpers
    return helpers.getMessages(userId, otherUsername);
  };

  return fnHash;

};