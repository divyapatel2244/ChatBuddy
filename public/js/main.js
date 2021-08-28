const socket=io();
const chatForm=document.getElementById("chat-form");
const chatmessage=document.querySelector('.chat-messages');
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

socket.emit("joinroom",{username,room});

socket.on("roomuser",({room,users})=>{
    outputuser(users);
    outputroom(room);
});

socket.on("message",message=>{
    outputmsg(message);
    chatmessage.scrollTop = chatmessage.scrollHeight;
});

chatForm.addEventListener('submit',e=>{
    e.preventDefault();
    let msg=e.target.elements.msg.value;
    msg=msg.trim();
    if(!msg){
        return false;
    }
    socket.emit("chatmsg",msg);
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();
});

function outputmsg(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`
        <p class="meta">${message.username}</p>
        <p class="text">
        ${message.text}
        </p>
        <p><span style="color:#33cc33;margin-top:2px;">${message.time}</span></p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputroom(room) {
    document.getElementById("room-name").innerText = room;
}
function outputuser(user) {
    document.getElementById("users").innerHTML = '';
    user.forEach((i) => {
        const li = document.createElement('li');
        li.innerText = i.username;
        document.getElementById("users").appendChild(li);
    });
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});

