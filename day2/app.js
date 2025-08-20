const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketIo = require('socket.io');
const io = socketIo(http);
const path = require('path');

http.listen(3000, () => {
    console.log('listening on *:3000');
})

app.get('/', (req, res) => {
    const options = {
        root: path.join(__dirname, 'index.html'),
    }
    res.sendFile(options.root, (err) => {
        if(err){
            console.error(err);
        }
        else {
            console.log('Sent: index.html');
        }
    })
})

let user = 0;

io.on('connection', (socket) => {
    console.log("User connected");
    user++;

    socket.emit("newUserConnected", "Hello new user!");

    socket.broadcast.emit("newUserConnected", `A new user has connected. Total users: ${user}`);

    socket.on('messageFromClientSide', (data) => {
        console.log('Message from client:', data);
    });
    

    socket.emit("messageFromServer", "Server is saying hello!");

    socket.on('disconnect', () => {
        console.log("User disconnected");
        user--;
        socket.broadcast.emit("newUserConnected", `A new user has disconnected. Total users: ${user}`);
    })
})