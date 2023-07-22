import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173"
    }
})

const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());







let serverTime = 0;
let interval;
function startClock(){
    let startTime = (Date.now() / 1000);

    let timeElapsed = serverTime;
    interval = setInterval(() => {
        serverTime = timeElapsed +  (Date.now() / 1000)- startTime ;
        io.emit("serverTime",serverTime);
        console.log(serverTime);

    }, 1000);

}
// Handle incoming socket connections
io.on('connection', (socket) => {
    console.log('A user connected.');




    socket.on('videoStarted',()=>{
        if (serverTime===0){
            console.log('hi');
            startClock()
        }

    })



    socket.on('play',()=>{ 

        console.log('play');

        startClock()

        io.emit('play');
        
    })

    socket.on('pause',()=>{
        console.log('pause');
        clearInterval(interval);
        io.emit('pause');
    })

    socket.on('seek',(seekedTime,requestTime)=>{
        clearInterval(interval);
        serverTime = seekedTime;
        startClock();
        io.emit('seek',seekedTime,requestTime);
    })
});



// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
