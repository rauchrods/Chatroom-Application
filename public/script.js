const socket = io();


let username = "";

let joinbtn = document.querySelector('#join-btn');
let usrformcontainer = document.querySelector('.username-form');
let chatboxcontainer = document.querySelector(".chat-box-container");


let sndbtnn = document.querySelector("#send-btn");
let sndmsg = document.querySelector("#message-input");
let exitbtn = document.querySelector("#exit-chatroom");




joinbtn.addEventListener('click', (e) => {
    e.preventDefault();

    username = document.querySelector('#username-input').value.trim();
    if (username == "") {
        alert("Please enter a username");
        return;
    }
    console.log(username);
    usrformcontainer.style.display = "none";
    chatboxcontainer.style.display = "flex";

    document.querySelector(".header>span").innerText = `Chatroom - ${username}`;
    socket.emit("user joined", username);
});


sndbtnn.addEventListener('click', () => {


    const data = {
        username: username,
        message: sndmsg.value,
    };

    socket.emit("message", data);

    addMessage(data, true);
}); 


//receive message
socket.on("message", (data) => {
    if (data.username !== username) {
        addMessage(data, false);
    }
});

socket.on("user joined", (data) => {
    if (data !== username) {
        let msgdiv = document.createElement("div");
        msgdiv.innerText = `${data} joined the conversation...`;
        msgdiv.setAttribute("class", "notify");
        document.querySelector(".chatbox").appendChild(msgdiv);
    }
});


socket.on("user left", (data) => {
    if (data !== username) {
        let msgdiv = document.createElement("div");
        msgdiv.innerText = `${data} left the conversation...`;
        msgdiv.setAttribute("class", "notify");
        document.querySelector(".chatbox").appendChild(msgdiv);
    }

    if(data===username){
        usrformcontainer.style.display = "flex";
        chatboxcontainer.style.display = "none";
        document.querySelector(".chatbox").innerHTML = "";
    }
});

function addMessage(data, sender) {
    let msgdiv = document.createElement("div");
    msgdiv.innerText = `${data.username}:${data.message}`;

    if (sender) {
        msgdiv.setAttribute("class", "message sent");
    }
    else {
        msgdiv.setAttribute("class", "message received");
    }

    document.querySelector(".chatbox").appendChild(msgdiv);
    sndmsg.value = "";

}

exitbtn.addEventListener("click", ()=>{
    socket.emit("user left", username);
});