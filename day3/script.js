const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketIo = require('socket.io');
const path = require('path');
const io = socketIo(http);

http.listen(8000, () => {
  console.log('listening on *:8000');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Namespace
const namespace = io.of('/namespace');

namespace.on('connection', (socket) => {
  console.log("User connected.");

  // user room join karega
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);

    // notify same room users
    namespace.to(roomName).emit('message', `Someone joined ${roomName}`);
  });

  // user room me message bheje
  socket.on('roomMessage', ({ roomName, message }) => {
    namespace.to(roomName).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log("User disconnected.");
  });
});
