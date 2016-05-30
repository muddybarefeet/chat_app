// //page to get the users friends and display them on the page
// // on clicking on a friend a user can chat to that one friend

// var friendActions = require('./../../../actions/friendActions.js');
// var friendsStore = require('./../../../stores/friendsStore.js');

// var React = require('react');
// var Link = require('react-router').Link;

// var Pending = React.createClass({

//   getInitialState: function () {
//     return {
//       pendingRequestIn: friendsStore.getFriendData().pendingRequestIn,
//       pendingRequestOut: friendsStore.getFriendData().pendingRequestOut
//     };
//   },

//   componentDidMount: function () {
//     friendsStore.addChangeListener(this._onChangeEvent);
//   },

//   componentWillUnmount: function () {
//     friendsStore.removeChangeListener(this._onChangeEvent);
//   },

//   _onChangeEvent: function () {
//     console.log('on change event in firends');
//     // friends have been got and now they need to be displayed
//     this.setState({
//       pendingRequestIn: friendsStore.getFriendData().pendingRequestIn,
//       pendingRequestOut: friendsStore.getFriendData().pendingRequestOut
//     });
//   },

//   seeFriendMessages: function () {
//     console.log('want to see chat History!');
//   },

//   render: function () {

//     return (
//       <div>
//         <h1>Pending Requests</h1>
//         <div>
//           <h3>Pending Friends Requests to Me</h3>
//           <ul>  
//             {this.state.pendingRequestIn.map(function(person, id) {
//                 console.log('in map');
//                return <li key={id} onClick={this.seeFriendMessages} >{person.username}</li>;
//             })}
//           </ul>
//         </div>
//         <div>
//           <h3>Pending Friends Requests I Have Made</h3>
//           <ul>  
//             {this.state.pendingRequestIn.map(function(person, id) {
//                 console.log('in map');
//                return <li key={id} onClick={this.seeFriendMessages} >{person.username}</li>;
//             })}
//           </ul>
//         </div>
//       </div>
//     );
//   }

// });

// module.exports = Pending;

