const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 500
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const { createServer } = require("http"); 
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require('body-parser');



const app=express();  
const httpServer = createServer(app);
app.use("/static", express.static('./static/'));
app.use(cors({credentials: true, origin: true}));
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))






const io = new Server(httpServer);

const EXPIRES=24*60*60*1000
const PROD = false
app.use(bodyParser.json())

app.use(session({
  secret: "skaskaskakaklxakx",
  resave: false,
  saveUninitialized: false,
  cookie: { path:"/", secure: true , httpOnly:true , maxAge:EXPIRES , secure:false}
}))


const rooms=[]

app.post("/rooms/create",(req,res)=>{
  const {username,userID} = req.body;
  const invitationID=uuidv4();
  const roomID=uuidv4();
  //initialize session
   

  rooms.push({
    currentlyPlaying:'',
    users:[{username:username,userID:userID,roomID:roomID}],
    invitationID:invitationID
  })
  req.session.userID=userID
  req.session.save(()=>{
    res.status(200).json({ redirect:`/rooms/${roomID}` })
  });
  


})

function auth(req, res, next) {
  if (req.session.userID) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next(); 
  } else {
    res.status(400).send("create or join a room"); 
  }
}

//these links are random and do not mean anything to other users, essentially they should only be accessed if a secret user session exists
app.get("/rooms/:id",auth,(req,res)=>{
  //request is authenticated
  const found = rooms.findIndex(room => room.users.some(user=>user.userID === req.session.userID));
  if (found>-1){
    const foundRoom=rooms[found]
    res.status(200).render("pages/paget.ejs");
  }
  else{
    res.status(400).send("create or join a room")
  }
  

})

app.get('/join/:id',(req,res)=>{
  const {id} = req.params;
  console.log(id);
  const found = rooms.findIndex(room => {
    return room.invitationID === id
  }
    );

  if (found>-1){
    const foundRoom=rooms[found]
    const userID=uuidv4();
    const roomID = uuidv4();
    foundRoom.users.push({username:"user",userID:userID,roomID:roomID})
    req.session.userID=userID;
    res.status(200).redirect(`../../rooms/${roomID}`)
  }
  else{
    res.status(404).send("not found")
  }
})

 
io.on("connection", (socket) => {
  // ...
  console.log("a user connected");
  const path = socket.handshake.auth.id
  const roomID = path.substring(7);
  const found = rooms.findIndex(room=> room.users.some(user=> user.roomID===roomID))
  if (found>-1){
    const room="room"+found
    socket.join(room)
    const roomInfo = { currentlyPlaying: rooms[found].currentlyPlaying, invitationLink:`http:localhost:500/join/${rooms[found].invitationID}` }
    socket.emit("joined",roomInfo)
    socket.on("upload",(videoId)=>{
      rooms[found].currentlyPlaying=videoId
      socket.to(room).emit("recieve",videoId);
    })
    socket.on("play",(callback)=>{
      socket.to(room).emit("recievedPlay");
      callback({
        status:"ok"
      });
    })
    socket.on("pause",()=>{
      socket.to(room).emit("recievedPause");
    })
    socket.on("playing",(time)=>{
      socket.to(room).emit("recievedTime",time);
    })
    socket.on("seeking",(seekedTime,callback)=>{
      socket.to(room).emit("recievedSeekedTime",seekedTime);
      callback({
        status:"ok"
      });
    })
  } else {
    console.log(rooms,roomID)
  }
  

});

httpServer.listen(PORT);
