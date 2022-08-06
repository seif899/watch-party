const express = require("express");
const { createServer } = require("http"); 
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, 
    {   cors: {
            origin:['http://localhost:5000']
        }
    });



//currentlyPlaying="id"
//room id
console.log

io.on("connection", (socket) => {
  // ...
  console.log("a user connected");
  socket.join("room1")
 
  socket.on("upload",(videoId)=>{
    
    socket.to("room1").emit("recieve",videoId);
  })
  socket.on("play",(callback)=>{
    
    socket.to("room1").emit("recievedPlay");
    callback({
      status:"ok"
    });
  })
  socket.on("pause",()=>{
    
    socket.to("room1").emit("recievedPause");
  })
  socket.on("playing",(time)=>{
    socket.to("room1").emit("recievedTime",time);
  })
  socket.on("seeking",(seekedTime,callback)=>{
  
    socket.to("room1").emit("recievedSeekedTime",seekedTime);
    callback({
      status:"ok"
    });
  })

});

httpServer.listen(3000);
