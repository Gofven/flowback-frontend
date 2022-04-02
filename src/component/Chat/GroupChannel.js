import { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { getRequest } from '../../utils/API';
const { REACT_APP_PROXY } = process.env;

export default function GroupChannel({ groupId }) {
  const [messageList, setMessageList] = useState([]);

  const token = JSON.parse(localStorage.getItem('jwtToken'));

  let socket;
  useEffect(() => {
    socket = new WebSocket(
      `wss://${REACT_APP_PROXY.split(':')[1]
      }ws/group_chat/${groupId}/?token=${token}`
    );

    socket.onopen = function (event) {
      console.log('[open] Connection established');
    };

    socket.onmessage = function (event) {
      console.log(
        `[message] Data received from server: ${JSON.parse(event.data).message.message
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
    const message = document.getElementById('groupchat-message').value;

    if (message !== '') {
      const messageBox = document.getElementById('groupchat-message');
      messageBox.value = '';
      socket.send(JSON.stringify({ message }));
      postToChatHistory(message);
    }
  };

  const postToChatHistory = (message) => {
    getRequest(`api/v1/chat/group/${groupId}`, { message }).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="group-chat">
      <div className="groupchat-messages" id="groupchat-messages">
        {messageList?.map((message) => (
          <div key={Math.random() * 1000000} className="chat-message">
            <Image
              className="pfp"
              src={`${message.user.image
                  ? `http://demo.flowback.org${message.user.image}`
                  : '/img/no-photo.jpg'
                }`}
            />
            <div className="chat-message-name-and-message">
              <div>{message.user.username}</div>
              <div>{window.t(message.message)}</div>
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
