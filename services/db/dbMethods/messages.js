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
      return insertedMessageRow[0];
    })
    .catch(function (err) {
      console.log('err in send message', err);
      throw err;
    });

  };

  //to recieve all messages sent to the client from other users
  fnHash.getMessages = function (userId) {

    var userMessages = {
      read: [],
      unread: {}
    };

    //go to the messgaes table and get all messages for that user
    return knex.select()
    .from('messages')
    .where('reciever_id', userId)
    .orWhere('sender_id', userId)
    .then(function (selectedMessages) {
      //loop through the array of users messages and add to the userMessages hash accordingly
      selectedMessages.forEach(function (element) {
        if (element.has_been_read) {
          userMessages.read.push(element);
        } else {
          userMessages.unread.push(element);
        }
      });
    })
    .catch(function (err) {
      console.log('err in getting a users messages', err);
      throw err;
    });


  };

  return fnHash;

};