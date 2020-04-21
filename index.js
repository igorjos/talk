const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const ip = "0.0.0.0";

if(process.argv && process.argv.includes('development'))
{
    const morgan = require('morgan');
    app.use(morgan('tiny'))
}

app.use(express.static(path.join(__dirname, 'public')));


const options = {
    key: fs.readFileSync('crts/key.pem'),
    cert: fs.readFileSync('crts/cert.pem')
};

const server = require('https').createServer(options, app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('New connection');
    
    socket.emit('welcome', 'Welcome message');
    socket.on('inputstream-video', (data) => {
        socket.broadcast.emit('outputstream-video', data);
    })

    socket.on('inputstream-audio', (data) => {
        socket.broadcast.emit('outputstream-audio', data);
    })
});

server.listen(port, ip, () => {
    console.log(`Server is listening on ${port}`);
});

