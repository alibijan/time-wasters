const express = require("express");
const { Server } = require("http");
const socketio = require("socket.io");

// App
const port = 3000;
const app = express();
const http = require("http").createServer(app);

app.use(express.static(`${__dirname}/../client`));

const io = socketio(http);

io.on('connection', (sock) => {
    sock.emit('message', 'You are connected');

    sock.on('message', (text) => io.emit('message', text));
});

http.on('error', (err) => {
    console.error(err);
});

http.listen(port, () => {
    console.log('server is ready');
});




// console.log('Hello server uwu ');


// const express = require('express');
// const { Server } = require('http');
// const app = express();
// const http = require('http').createServer(app);
// const socketio = require('socket.io')(http);

// app.use(express.static('../client/'));

// socketio.on('connection', (socket) => {
//     // console.log('somebody has connected : ) ');

//     socketio.emit('message', 'A new user has connected.');

//     socketio.on('message', (text) => {
//         socketio.emit('message', text);
//     });

//     // socketio.on('sentMessage', (text) => {
//     //     socketio.emit('sentMessage', text);
//     // });
// });

// http.on('error', (err) => {
//     console.error(err);
// });

// http.listen(3000, () => {
//     console.log('listening on localhost:3000');
// });



// const port = 3000;
// const path = require('path');
// const socketio = require('socket.io')(http);

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// })












// app.get('/', (req, res) => {
//     // res.send('hello expwessie uwu =w=');
//     res.sendFile(path.join(__dirname, '../client', 'index.html'));
// })
// app.all('/', function (req, res) {
//     // res.sendFile(path.join(__dirname, '../client', 'index.html'));
//     res.send('Got a POST request')
// })
// app.get('/404', (req, res) => {
//     res.send('404 page');
// })







// const http = require('http');
// const express = require('express');

// const app = express();

// app.use(express.static('../client/'));

// const server = http.createServer(app);

// server.on('error', (err) => {
//     console.error(err);
// });

// server.listen(8080, () => {
//     console.log('server is ready');
// });