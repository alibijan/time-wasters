const express = require('express');
const socketio = require('socket.io');

// App
const port = process.env.PORT || 3000;
const app = express();
const http = require('http').createServer(app);

app.use(express.static(`${__dirname}/../client`));

const io = socketio(http);

io.on('connection', (sock) => {
    // user name
    let previousName;
    let currentName;
    sock.on('name', (name) => {
        previousName = name[name.length - 2];
        currentName = name[name.length - 1];
        // console.log(`prev log name: ${previousName}`);
        // console.log(`curr log name: ${currentName}`);

        // if name is set and user disconnects, send message.
        sock.on('disconnect', () => {
            sock.broadcast.emit('message', `${currentName} has disconnected.`);
        })
        if( previousName === undefined ) {
            // sock.broadcast.emit('message', `User has changed name to ${currentName}`);
            sock.broadcast.emit('newUser', `${currentName} has connected`);
        } else {
            sock.broadcast.emit('message', `${previousName} has changed their name to ${currentName}`);
        }
    });

    io.emit('message', 'version 1');

    // user connected
    // sock.broadcast.emit('newUser', 'New user connected.');
    // console.log('New user has connected');

    // messages
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
    console.log(`server is ready, listening on ${port}`);
});