(function () {
  const socket = window.io();
  const messages = document.getElementById(`messages`);
  const locationBtn = document.getElementById(`send-location`);

  locationBtn.addEventListener(`click`, function () {
    if (!navigator.geolocation) {
      return alert(`Geolocation is not supported in your browser`);
    }

    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit(`createLocationMessage`, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, function () {
      alert(`Unable to fetch location`);
    })
  });

  socket.on(`newLocationMessage`, function (message) {
    const a = document.createElement(`a`);

    a.innerHTML = `My current location`;
    a.setAttribute(`target`, `_blank`);
    a.setAttribute(`href`, message.url);

    const li = document.createElement(`li`);
    li.append(`${message.from}: `, a);

    messages.appendChild(li);

  });

  socket.on(`connect`, function () {
    socket.emit(`newUser`, `Admin`);
  });

  socket.on(`newMessage`, function (message) {
    console.log(`newMessage`, message);

    const li = document.createElement(`li`);

    li.innerHTML = `${message.from}: ${message.text}`;
    messages.appendChild(li);
  });

  socket.on(`newUserJoined`, function (name) {
    console.log(`Joined:`, name);
  });

  const form = document.getElementById(`message-form`);
  form.addEventListener(`submit`, function (e) {
    e.preventDefault();

    socket.emit(`createMessage`, {
      from: `User`,
      text: form.elements.message.value
    }, function () {

    });
  });
})();
