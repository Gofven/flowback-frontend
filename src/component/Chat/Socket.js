export default function Socket() {
  const token = JSON.parse(localStorage.getItem('jwtToken'));
  const socket = new WebSocket(
    `wss://demo.flowback.org/ws/group_chat/1/?token=${token}`
  );

  // const [message, setMessage] = useState('');

  socket.onopen = function (event) {
    console.log('[open] Connection established');
  };

  socket.onmessage = function (event) {
    console.log(`[message] Data received from server: ${event.data}`);
    document
      .getElementById('groupchat-messages')
      .append(<li>{JSON.parse(event.data).message}</li>);
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

  return socket;
}
