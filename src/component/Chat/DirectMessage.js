import { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
const { REACT_APP_PROXY } = process.env;

export default function DirectMessage({ groupId }) {
  const [messageList, setMessageList] = useState([]);

  const token = JSON.parse(localStorage.getItem('jwtToken'));

  let socket;
  useEffect(() => {
    socket = new WebSocket(
      `wss://${REACT_APP_PROXY.split(':')[1]}ws/direct_chat/?token=${token}`
    );

    socket.onopen = function (event) {
      console.log('[open] Connection established');
    };

    socket.onmessage = function (event) {
      console.log(
        `[message] Data received from server: ${
          JSON.parse(event.data).message
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

  useEffect(() => {
    document.getElementById('groupchat-messages').scrollBy(100000, 100000);
  }, [messageList]);

  const submitMessage = (e) => {
    e.preventDefault();
    // socket.send("hii");
    const messageBox = document.getElementById('groupchat-message');
    const message = document.getElementById('groupchat-message').value;
    messageBox.value = '';

    if (message !== '') socket.send(JSON.stringify({ message, target: 2 }));
  };

  return (
    <div className="group-chat">
      <div className="groupchat-messages" id="groupchat-messages">
        {messageList?.map((message) => (
          <div key={Math.random() * 1000000} className="chat-message">
            <Image
              className="pfp"
              src={`${
                message.user.image
                  ? `http://demo.flowback.org${message.user.image}`
                  : '/img/no-photo.jpg'
              }`}
            />
            <div className="chat-message-name-and-message">
              <div>{message.user.username}</div>
              <div>{message.message}</div>
            </div>
          </div>
        ))}
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
        <button type="submit" className="btn btn-secondary">
          Send
        </button>
      </form>
    </div>
  );
}
