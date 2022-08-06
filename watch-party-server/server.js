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

app.get("/",(req,res)=>res.send("halo"))
io.on("connection", (socket) => {
  // ...
  console.log("a user connected");
  socket.join("room1")
  socket.on("upload",(videoId)=>{
    console.log(videoId);
    socket.to("room1").emit("recieve",videoId);
  })
  socket.on("play",()=>{
    console.log("play");
    socket.to("room1").emit("recievedPlay");
  })
  socket.on("pause",()=>{
    console.log("pause");
    socket.to("room1").emit("recievedPause");
  })
  socket.on("playing",(time)=>{
    console.log(time);
    socket.to("room1").emit("recievedTime",time);
  })
  socket.on("seeking",(seekedTime)=>{
    console.log(seekedTime);
    socket.to("room1").emit("recievedSeekedTime",seekedTime);
  })
});

httpServer.listen(3000);
