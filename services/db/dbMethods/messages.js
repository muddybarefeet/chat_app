//this is for person to person messaging

module.exports = function (knex) {

  var fnHash = {};

  //to click on a friend and to send them a message
  fnHash.sendMessage = function (userId, recipient, message) {
    //insert into the messages table the sender, the recipient and the message(only can send messgae if they are friends 
    //and get friends will have this updated so dont need to check they are friends)
    return knex.select('u_id')
    .from('users')
    .where('username', recipient)
    .then(function (arrayOfId) {
      return knex('messages')
      .insert({
        sender_id: userId,
        reciever_id: arrayOfId[0].u_id,
        message: message,
        has_been_read: false
      },'*');
    })
    .then(function (insertedMessageRow) {
      return knex.select()
      .from('messages')
      .orderBy('created_at', 'asc');
    })
    .catch(function (err) {
      console.log('err in send message', err);
      throw err;
    });

  };

  //function triggered on a user reading a message to set has_been_read to true
  fnHash.updateMessageStatus = function (userId, message) {

    //update the has_been_read cell in the messages table to true
    return knex('messages')
    .where('reciever_id', userId)
    .andWhere('message', message)
    .update({
      has_been_read: true
    }, '*')
    .then(function (newRow) {
      return newRow[0];
    })
    .catch(function (err) {
      console.log('err updating read message status');
      throw err;
    });

  };

  //to recieve all messages sent to the client from other users
  fnHash.getMessages = function (userId, otherUsername) {

    //get the id of the other user
    return knex.select('u_id')
    .from('users')
    .where('username', otherUsername)
    .then(function (otherUserId) {
      //get all messages between the users
      return knex.select()
      .from('messages')
      .where(function () {
        this.where('sender_id', userId)
        .andWhere('reciever_id', otherUserId[0].u_id);
      })
      .orWhere(function () {
        this.where('sender_id', otherUserId[0].u_id)
        .andWhere('reciever_id', userId);
      })
      .orderBy('created_at', 'asc');
    })
    .then(function (selectedMessages) {
      //loop through the array of users messages and add to the userMessages hash accordingly
      return selectedMessages;
    })
    .catch(function (err) {
      console.log('err in getting a users messages', err);
      throw err;
    });

  };

  return fnHash;

};