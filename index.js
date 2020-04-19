const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const ip = "0.0.0.0";

app.use(express.static(path.join(__dirname, 'public')));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('New connection');
    
    socket.emit('welcome', 'Welcome message');
    socket.on('inputstream', (data) => {
        socket.broadcast.emit('outputstream', data);
    })
});

server.listen(port, ip, () => {
    console.log(`Server is listening on ${port}`);
});

