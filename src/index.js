const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage,generateLocationMessage} = require('../src/utils/messages');
const {addUser,removeUser,getUser,getUsersInRoom} = require('../src/utils/users');

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

    socket.on('join',({username, room},callback)=>{
        const{error,user} = addUser({id:socket.id,username,room});
        if(error){
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message',generateMessage('System','Welcome'));
        socket.broadcast.to(user.room).emit('message',generateMessage('System',`${user.username} has joined!`));
        io.to(user.room).emit('roomData',{
            room: user.room,
            users : getUsersInRoom(user.room)
        });
        callback();
        //socket.emit,io.emit,socket.broadcast.emit
        //io.to.emit, socket.broadcast.to.emit -- specific to rooms
    });

    socket.on('sendMessage',(message, callback)=>{
        const user = getUser(socket.id);
        const filter = new Filter();

        if(filter.isProfane(message)){
            return callback('profanity is not allowed');
        }
        io.to(user.room).emit('message',generateMessage(user.username,message));
        callback();
    })

    socket.on('sendLocation',(urlmap, callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit("locationMessage",generateLocationMessage(user.username,urlmap));
        callback();
    });

    socket.on('disconnect',()=>{
        const user= removeUser(socket.id);
        console.log(user);
        if(user){
            io.to(user.room).emit('message',generateMessage("System",`${user.username} has left!`));
        }
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        
    });

    

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