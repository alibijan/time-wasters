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
    let previousName;
    let currentName;
    // io.emit('message', 'hey guiz :) whatsup');
    // sock.emit('message', 'New user connected!!!');
    // io.emit('newUser', 'You are connected.');
    sock.on('name', (name) => {
        previousName = name[name.length - 2];
        currentName = name[name.length - 1];
        console.log(`server log: name: ${name[name.length - 1]}`);
        if( previousName === undefined ) {
            sock.broadcast.emit('message', `User has changed name to ${currentName}`);
        } else {
            sock.broadcast.emit('message', `${previousName} has changed their name to ${currentName}`);
        }
    });
    sock.broadcast.emit('newUser', 'New user connected.');
    sock.on('message', (text) => {
        // console.log(text);
        if( currentName ) {
            io.emit('message', `<span class='username'>${currentName}:</span> ${text}`);
        }
    });
});

http.on('error', (err) => {
    console.error(err);
});

http.listen(port, () => {
    console.log('server is ready');
});