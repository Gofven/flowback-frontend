import { useEffect, useState, createContext, useContext } from 'react';


export default function GroupChannels() {
  let socket;
  useEffect(() => {
  
    const token = JSON.parse(localStorage.getItem('jwtToken'));
    socket = new WebSocket(
      `wss://demo.flowback.org/ws/group_chat/1/?token=${token}`
    );
  
    socket.onopen = function (event) {
      console.log('[open] Connection established');
    };
  
    socket.onmessage = function (event) {
      console.log(`[message] Data received from server: ${JSON.parse(event.data).message.message}`);
      const messageDisplayed = document.createElement("div")
      const data = JSON.parse(event.data);
      messageDisplayed.innerHTML = `<img src="http://demo.flowback.org${data.user.image}" alt="User Profile" class="pfp"/> <div>${data.user.username}</div> <div>${data.message.message}</div>`
      document.getElementById("groupchat-messages").append(messageDisplayed)
    };
  
    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.warn('[close] Connection died');
      }
    };
  
    socket.onerror = function (error) {
      console.error(`[error] ${error.message}`);
    };
  
    return(() => {
      socket.close();
    })
  })
  
  const submitMessage = (e) => {
    e.preventDefault();
    // socket.send("hii");
    const messageBox = document.getElementById('groupchat-message')
    const message = document.getElementById('groupchat-message').value;
    messageBox.value = ""
    
    socket.send(JSON.stringify({ message }));
  };

  return (
    <div>
      <div>
        <form name="publish" onSubmit={submitMessage}>
          <input type="text" id="groupchat-message"  />
          <input type="submit" />
        </form>
      </div>
      <div>
        <div id="groupchat-messages"></div>
      </div>
    </div>
  );
}
