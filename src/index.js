const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

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

    socket.emit('message','Welcome bro!!');

    socket.on('sendMessage',(message)=>{
        io.emit('message',message);
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