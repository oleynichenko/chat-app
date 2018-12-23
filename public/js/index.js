(function () {
  const socket = window.io();

  socket.on(`connect`, function () {
    socket.emit(`newUser`, `Admin`);
  });

  socket.on(`newMessage`, function (message) {
    console.log(message);
  });

  socket.on(`newUserJoined`, function (name) {
    console.log(`Joined:`, name);
  });

})();
