const e = require("express");
const express = require("express");
const socketio = require("socket.io");

// App
const port = 3000;
const app = express();
const http = require("http").createServer(app);

app.use(express.static(`${__dirname}/../client`));

const io = socketio(http);

io.on('connection', (sock) => {
    // io.emit('message', 'hey guiz :) whatsup');
    // sock.emit('message', 'New user connected!!!');
    io.emit('newUser', 'New user connected.');
    sock.on('message', (text) => {
        console.log(text);
        io.emit('message', text);
    });
    sock.on('name', (name) => {
        const previousName = name[name.length - 2];
        const currentName = name[name.length - 1];
        // console.log(`server log: name: ${name[name.length - 1]}`);
        if( previousName === undefined ) {
            sock.broadcast.emit('message', `User has changed name to ${currentName}`);
        } else {
            sock.broadcast.emit('message', `${previousName} has changed their name to ${currentName}`);
        }
    });
});

http.on('error', (err) => {
    console.error(err);
});

http.listen(port, () => {
    console.log('server is ready');
});