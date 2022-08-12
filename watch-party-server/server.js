const express = require("express");
const { createServer } = require("http"); 
const { Server } = require("socket.io");
const cors=require('cors')
const bodyParser=require('body-parser')
const { v4: uuidv4 } = require('uuid');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, 
    {   cors: {
            origin:['http://localhost:5000']
        }
    });
app.use(bodyParser.json())
app.use(cors())

//currentlyPlaying="id"
//room id
const rooms=[]

app.post("/create/:id",(req,res)=>{
  console.log(req.body)
  const {username,id} = req.body;
  rooms.push({
    currentlyPlaying:'',
    users:[username],
    invitationID:uuidv4()
  })
  res.json("successefully created")
})

app.get('/join',(req,res)=>{
  //find the room
  console.log(rooms)
  rooms[0].users.push("user2");
  res.json(rooms[0])
})

io.on("connection", (socket) => {
  // ...
  console.log("a user connected");
  socket.join("room1",(username)=>{
    //socket.emit("currentlyPlaying",rooms[0].currentlyPlaying)
  })
 
  socket.on("upload",(videoId)=>{
    rooms[0].currentlyPlaying=videoId
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
