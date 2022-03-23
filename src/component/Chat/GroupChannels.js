import { useEffect } from "react";

export default function GroupChannels() {

  let socket = new WebSocket("wss://demo.flowback.org/ws/chat/test");
  
  console.log(socket)

  socket.onopen = function(event) {
    alert("[open] Connection established");
    alert("Sending to server");
    socket.send("My name is John");
  };
  useEffect(() =>{
    
    // socket.onmessage = function(event) {
    //   alert(`[message] Data received from server: ${event.data}`);
    // };
    
    // socket.onclose = function(event) {
    //   if (event.wasClean) {
    //     alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    //   } else {
    //     // e.g. server process killed or network down
    //     // event.code is usually 1006 in this case
    //     alert('[close] Connection died');
    //   }
    // };
    
    // socket.onerror = function(error) {
    //   alert(`[error] ${error.message}`);
    // };
  },[])



  return (
    <div>
      <div>
        <div>ny grupp</div>

        <div>Grupp 2</div>
      </div>
      <div>
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
