const socket = io();

const TextArea = document.querySelector('.chat-box');
const messagebox = document.querySelector('.chatbox');
const AttachFile = document.querySelector('.fileupload');

const form1 = document.querySelector('.msgsub');

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

/*TextArea.addEventListener('keyup',function(e){
  //  e.preventDefault();
    if(e.key === "Enter"){
        sendMessage(e.target.value);
    }
});*/

//creating room--
let name;
const form2 = document.querySelector('.roomsub')
const Username = document.querySelector('.username');
const Roomcode = document.querySelector('.roomcode');
const RoomCode = document.querySelector('.roomusers');


form2.addEventListener('submit',function(e){
    e.preventDefault();
    let userroomdata = {
        username: Username.value,
        roomcode:Roomcode.value
    }
    name = userroomdata.username;
    RoomCode.innerHTML = `RoomCode: ${userroomdata.roomcode}`;
    var disabled = Roomcode.disabled;
    if (disabled) {
        Roomcode.disabled = false;
      } else {
        Roomcode.disabled = true;
      document.querySelector('.reloadimage').innerHTML = `<button style="padding: 0; border: 0;" onclick="window.location.reload()"><img src="images/reloadimg.jpg" alt="reloadimage" class="reloadimg"></img></button>`;
      }
   socket.emit('joinRoom',userroomdata);
})

//roomUsers--
socket.on('roomUsers',function(Users){
    console.log(Users);
    outputUsers(Users);
})

const totalUsers = document.querySelector('.onlinebox');

function outputUsers(Users){
   totalUsers.innerHTML = `
    ${Users.map(user=> `<li class="Userlist">${user.username} </li>`).join('')}
    `;

}

///eventlistner for button--


    form1.addEventListener('submit',function(e){
        e.preventDefault();
         const message = (TextArea.value || AttachFile.value);
         console.log(AttachFile.value);
         sendMessage(message);
    })
function sendMessage(message){
    let msg = {
        user: name,
        message: message
    }
    appendMessage(msg,'right');
         TextArea.value="";
    socket.emit('message',msg);
}
var audio = new Audio('audio.mp3');

function appendMessage(msg,position){
    const messageElement = document.createElement('div');
    messageElement.classList.add('msg',position);
   if(position === 'left'){
    messageElement.innerHTML =`<h4>${msg.user}</h4><span>${formatAMPM(new Date)}</span> 
    <p>${msg.message}</p>.`;
    audio.play();
   }
   else{
    messageElement.innerHTML = `<h4>You</h4><span>${formatAMPM(new Date)}</span>
    <p>${msg.message}</p>.`;
   }
   messagebox.append(messageElement);
   scrollToBottom();
}

socket.on('receive',function(msg){
    appendMessage(msg,'left');
})

socket.on('offline',function(name){
    const offlineobj ={
        user: name,
        message:`${name} left the chat.`
    }
    appendMessage(offlineobj,'left');
})


function scrollToBottom(){
    messagebox.scrollTop = messagebox.scrollHeight;
}