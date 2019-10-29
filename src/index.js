const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

const port =process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));

app.get('',(req,res)=>{
    res.render('index');
});

server.listen(port,()=>{
    console.log("server is up and running"+ port)
});