import { useEffect, useState } from 'react';

export default function GroupChannels() {
  const token = JSON.parse(localStorage.getItem('jwtToken'));
  const socket = new WebSocket(
    `wss://demo.flowback.org/ws/group_chat/1/?token=${token}`
  );

  const [message, setMessage] = useState('');

  socket.onopen = function (event) {
    // alert('[open] Connection established');
    // alert('Seknding to server');
    socket.send(JSON.stringify({message:'My name is John'}));
    setTimeout(() => {
      socket.send(JSON.stringify({message:"HIIIIIII"}))
    }, 5000)
    // socket.send("HIIIIIII")
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      alert(
        `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      alert('[close] Connection died');
    }
  };

  socket.onerror = function (error) {
    alert(`[error] ${error.message}`);
  };

  socket.onmessage = (event) => {
    // setMessage(event.data);
  };

  const submitMessage = (e) => {
    e.preventDefault();
    socket.send(message);
  };

  const handleChange = (e) => {
    setMessage(e.value);
  };

  return (
    <div>
      <div>
        <form name="publish" onSubmit={submitMessage}>
          <input type="text" name="message" onChange={handleChange} />
          <input type="submit" />
        </form>

        <div id="messages"></div>
        <div>ny grupp</div>

        <div>Grupp 2</div>
      </div>
      <div>
        {/* <div>Message:{message}</div> */}
        <div>---kanal 1</div>
        <div>---kanal 2</div>
        <div>---kanal 3</div>
      </div>
      <div>
        <div>Cooldude: Yo wzzup guys?</div>
        <div>Cringe dude is currently typing...</div>
        <div>[YEAH BROOOO I went the other da]</div>
      </div>
    </div>
  );
}
