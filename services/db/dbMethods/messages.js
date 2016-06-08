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

    //update the has_been_read cell in the messages table to true when the message was snet to the user
    return knex('messages')
      .where('reciever_id', userId)
      .update({
        has_been_read: true
      }, '*')
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
    //get all messages the user in in where the messages have not been read
    return knex.select()
      .from('messages')
      .where(function() {
        this.where('sender_id', userId)
        .orWhere('reciever_id', userId);
      })
      .andWhere('has_been_read', false)
      .orderBy('created_at', 'asc')
    .then(function (selectedMessages) {
      //get all the userids not the user and look up the usernames and return these
      var userIds = selectedMessages.map(function (message) {
        if (message.sender_id !== userId) {
          return message.sender_id;
        }
        return message.userId;
      });

      return knex.select()
      .from('users')
      .whereIn('u_id', userIds);
    })
    .then(function (userInfo) {
      return userInfo;
    })
    .catch(function (err) {
      console.log('err in getting a users unread messages from friends', err);
      throw err;
    });

  };

  //get specific conversation between you and a user
  fnHash.getMessagesFromFriend = function (userId, otherUsername) {
    // call the function from the helpers
    return helpers.getMessages(userId, otherUsername);

  };

  return fnHash;

};