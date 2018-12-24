const express = require(`express`);
const path = require(`path`);
const http = require(`http`);
const socketIO = require(`socket.io`);

const {generateMessage, generateLocationMessage} = require(`./utils/message`);
const port = process.env.PORT || 3000;
const app = express();



app.use(express.static(path.join(__dirname, `../public`)));
const server = http.createServer(app);

const io = socketIO(server);

io.on(`connection`, (socket) => {
  console.log(`New user connected`);

  socket.emit(`newMessage`, generateMessage(`Admin`, `Welcome to the app chat`));

  socket.on(`newUser`, () => {
    socket.broadcast.emit(`newMessage`, generateMessage(`Admin`, `New user joined`));
  });

  socket.on(`createMessage`, (message) => {
    console.log(`creatMessage`, message);

    io.emit(`newMessage`, generateMessage(message.from, message.text));
  });

  socket.on(`createLocationMessage`, (coords) => {
    io.emit(`newLocationMessage`, generateLocationMessage(`Admin`, coords.latitude, coords.longitude));
  });

  socket.on(`disconnect`, () => {
    console.log(`New user disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server is on`);
});
