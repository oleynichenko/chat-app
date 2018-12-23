const express = require(`express`);
const path = require(`path`);
const http = require(`http`);
const socketIO = require(`socket.io`);

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, `../public`)));
const server = http.createServer(app);

const io = socketIO(server);

io.on(`connection`, (socket) => {
  console.log(`New user connected`);

  socket.emit(`newMessage`, {
    from: `Admin`,
    text: `Welcome to the app chat`
  });

  socket.on(`newUser`, (name) => {
    socket.broadcast.emit(`newUserJoined`, name);
  });

  socket.on(`createMessage`, (message) => {
    console.log(`creatMessage`, message);

    io.emit(`newMessage`, {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on(`disconnect`, () => {
    console.log(`New user disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server is on`);
});
