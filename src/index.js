const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage,generateLocationMessage} = require('../src/utils/messages');

const app = express();
const server = http.createServer(app);
//socketio expects raw http server, so we re-configured.
const io = socketio(server);

const port =process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));

let count =0;

//socket is an object that contains information regarding connection
io.on('connection',(socket)=>{
    console.log("New websocket Connection");

    socket.emit('message',generateMessage('Welcome'));
    socket.broadcast.emit('message',generateMessage('A new user has joined'));

    socket.on('sendMessage',(message, callback)=>{
        const filter = new Filter();

        if(filter.isProfane(message)){
            return callback('profanity is not allowed');
        }
        io.emit('message',generateMessage(message));
        callback();
    })

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user got disconnected'));
    });

    socket.on('sendLocation',(urlmap, callback)=>{
        io.emit("locationMessage",generateLocationMessage(urlmap));
        callback();
    })
    // //send an event from server to get received by client(chat.js) ...count is available from callback
    // socket.emit('countUpdated',count);

    // socket.on('increment',()=>{
    //     count++;
    //     //socket emits to particular connection, io emits to every connection
    //     //socket.emit('countUpdated,count);
    //     io.emit('countUpdated',count);
    // });

})


server.listen(port,()=>{
    console.log("server is up and running "+ port)
});