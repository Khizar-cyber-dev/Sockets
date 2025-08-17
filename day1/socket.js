const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

server.listen(4000, () => {
    console.log('Server is listening on port 4000');
})

app.get('/', (req, res) => {
    const options = {
        root: path.join(__dirname, 'index.html'),
    }
    res.sendFile(options.root)
})

io.on('connection', (socket) => {
    console.log("User connected");

    socket.on('disconnect', () => {
        console.log("User disconnected");
    })
})