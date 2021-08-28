const path=require('path');
const express=require("express");
const http=require('http');
const formatmessage=require('./public/util/messages');
const {userjoin,getcurrentuser,userleave,getroom}=require('./public/util/users');
const socketio=require("socket.io");
const app=express();
const server=http.createServer(app);
const io = socketio(server);
const botname="chatBot";

io.on("connection",socket=>{
    //console.log("conection establish");
    socket.on("joinroom",({username,room})=>{
        //alert("hiiii");
        const user=userjoin(socket.id,username,room);
        socket.join(user.room);
        io.to(user.room).emit("roomuser",{
            room:user.room,
            users:getroom(user.room)
        });
        socket.broadcast
        .to(user.room)
        .emit("message", formatmessage(botname, `${user.username} has joined`));
        
    })
    socket.on("chatmsg",msg=>{
        const user=getcurrentuser(socket.id);
            io.to(user.room).emit("message",formatmessage(user.username,msg));
     });
    socket.on("disconnect", () => {
        const user = userleave(socket.id);
        if (user) {
            io
            .to(user.room)
            .emit("message", formatmessage(botname, `${user.username} has left`));
            io.to(user.room).emit("roomuser", {
                room: user.room,
                users: getroom(user.room)
            });
        }

    });
});

app.use(express.static(path.join(__dirname,'public')));

const PORT=3000||process.env.PORT;

server.listen(PORT,()=>console.log(`Server is on ${PORT}`));