(function () {
  const socket = window.io();
  const messages = document.getElementById(`messages`);
  const users = document.getElementById(`users`);
  const locationBtn = document.getElementById(`send-location`);
  const form = document.getElementById(`message-form`);
  const templateScript = document.getElementById(`message-template`);
  const templateLocationScript = document.getElementById(`location-message-template`);

  const _formatTime = (time) => {
    return window.moment(time).format(`h:mm a`);
  };

  const scrollToBottom = () => {
    // Selectors
    const newMessage = messages.lastElementChild;
    // Heights
    const clientHeight = messages.clientHeight;
    const scrollTop = messages.scrollTop;
    const scrollHeight = messages.scrollHeight;

    const newMessageHeight = (newMessage) ? newMessage.clientHeight : 0;
    const lastMessageHeight = (messages.children.length >= 2)
      ? messages.children[messages.children.length - 2].clientHeight
      : 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop = scrollHeight;
    }
  };

  socket.on(`newLocationMessage`, function (message) {
    const template = templateLocationScript.innerHTML;

    const html = window.Mustache.render(template, {
      from: message.from,
      url: message.url,
      createdAt: _formatTime(message.createdAt)
    });

    messages.insertAdjacentHTML(`beforeEnd`, html);
    scrollToBottom();
  });

  socket.on(`connect`, function () {
    const params = window.deparam();

    socket.emit(`join`, params, function (err) {
      if (err) {
        window.location.href = `/`;
      } else {
        console.log(`No errors`);
      }
    });
  });

  socket.on(`newMessage`, function (message) {
    const template = templateScript.innerHTML;

    const html = window.Mustache.render(template, {
      from: message.from,
      text: message.text,
      createdAt: _formatTime(message.createdAt)
    });

    messages.insertAdjacentHTML(`beforeEnd`, html);
    scrollToBottom();
  });

  socket.on(`newUserJoined`, function (name) {
    console.log(`Joined:`, name);
  });

  socket.on(`updateUserList`, function (usersNames) {
    const fragment = document.createDocumentFragment();

    usersNames.forEach((name) => {
      const li = document.createElement(`li`);
      li.innerHTML = name;
      fragment.appendChild(li);
    });

    users.innerHTML = ``;
    users.appendChild(fragment);
  });

  locationBtn.addEventListener(`click`, function () {
    if (!navigator.geolocation) {
      alert(`Geolocation is not supported in your browser`);
    }

    locationBtn.setAttribute(`disabled`, `disabled`);
    locationBtn.innerHTML = `Sending...`;

    navigator.geolocation.getCurrentPosition(function (position) {
      socket.emit(`createLocationMessage`, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      locationBtn.removeAttribute(`disabled`);
      locationBtn.innerHTML = `Send Location`;
    }, function () {
      locationBtn.removeAttribute(`disabled`);
      locationBtn.innerHTML = `Send Location`;
      alert(`Unable to fetch location`);
    });
  });

  form.addEventListener(`submit`, function (e) {
    e.preventDefault();

    const messageInput = form.elements[`message`];

    socket.emit(`createMessage`, {
      text: messageInput.value
    }, function () {
      messageInput.value = ``;
    });
  });
})();
