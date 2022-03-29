import { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';

export default function GroupChannel({ groupId }) {
  const [messageList, setMessageList] = useState([
    {
      message: { type: 'chat_message', message: 'f' },
      user: { username: 'svenbergemil@gmail.com', image: '/media/oopsy.png' },
    },
  ]);

  const token = JSON.parse(localStorage.getItem('jwtToken'));

  let socket;
  useEffect(() => {
    socket = new WebSocket(
      `wss://demo.flowback.org/ws/group_chat/${groupId}/?token=${token}`
    );

    socket.onopen = function (event) {
      console.log('[open] Connection established');
    };

    socket.onmessage = function (event) {
      console.log(
        `[message] Data received from server: ${
          JSON.parse(event.data).message.message
        }`
      );
      const data = JSON.parse(event.data);
      setMessageList([...messageList, data]);
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

    return () => {
      socket.close();
    };
  });

  const submitMessage = (e) => {
    e.preventDefault();
    // socket.send("hii");
    const messageBox = document.getElementById('groupchat-message');
    const message = document.getElementById('groupchat-message').value;
    messageBox.value = '';

    socket.send(JSON.stringify({ message }));
  };

  return (
    <div>
      <div id="groupchat-messages">
        {messageList?.map((message) => 
          <div key={Math.random()*1000000}>
            <div>{message.user.username}</div>
            <Image
              className="pfp"
              src={`${
                message.user.image
                  ? `http://demo.flowback.org${message.user.image}`
                  : '/img/no-photo.jpg'
              }`}
            />
            <div>{message.message.message}</div>
          </div>
        )}
      </div>

      <form
        name="publish"
        className="chat-message-box"
        onSubmit={submitMessage}
      >
        <input
          type="text"
          id="groupchat-message"
          className="chat-message-input-box"
        />
        <input type="submit" className="btn btn-primary" placeholder="Send" />
      </form>
    </div>
  );
}
