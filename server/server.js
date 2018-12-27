const express = require(`express`);
const path = require(`path`);
const http = require(`http`);
const socketIO = require(`socket.io`);
const Users = require(`./utils/users`);

const users = new Users();

const {generateMessage, generateLocationMessage} = require(`./utils/message`);
const {isRealString} = require(`./utils/validation`);

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, `../public`)));
const server = http.createServer(app);

const io = socketIO(server);

io.on(`connection`, (socket) => {
  console.log(`New user connected`);

  socket.on(`join`, (params, cb) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return cb(`Name and room name are required`);
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit(`updateUserList`, users.getUserList(params.room));

    socket.emit(`newMessage`, generateMessage(`Admin`, `Welcome to the app chat`));

    socket.broadcast
      .to(params.room)
      .emit(`newMessage`, generateMessage(`Admin`, `${params.name} has joined`));

    return cb();
  });

  socket.on(`createMessage`, (message, cb) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room)
        .emit(`newMessage`, generateMessage(user.name, message.text));
    }

    cb();
  });

  socket.on(`createLocationMessage`, (coords) => {
    const user = users.getUser(socket.id);

    if (user) {
      io.to(user.room)
        .emit(`newLocationMessage`, generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on(`disconnect`, () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(`updateUserList`, users.getUserList(user.room));
      io.to(user.room).emit(`newMessage`, generateMessage(`Admin`, `${user.name} has left`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is on`);
});
