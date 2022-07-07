import { useEffect, useState } from "react";
import { getLocalStorage } from "../../utils/localStorage";
const { REACT_APP_PROXY } = process.env;

export default function ChatScreen({ messageList, setMessageList, messaging }) {
    const token = JSON.parse(localStorage.getItem('jwtToken'));
    // const [canSend, setCanSend] = useState(false)
    let socket;

    useEffect(() => {
        socket = new WebSocket(
            `wss://${REACT_APP_PROXY.split(':')[1]}/ws/direct_chat/?token=${token}`
        );

        socket.onopen = function (event) {
            console.log('[open] Connection established');
            // setCanSend(true)
        };

        socket.onmessage = function (event) {
            console.log(
                `[message] Data received from server: ${JSON.parse(event.data).message}`
            );
            const data = JSON.parse(event.data);
            setMessageList([...messageList, { message: data.message, username: data.user.username, image: data.user.image, created_at: new Date() }]);
            // setMessageList([...messageList, data]);
        };

        socket.onclose = function (event) {
            // setCanSend(false)
            if (event.wasClean) {
                console.log(
                    `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                console.warn('[close] Connection died');
            }
        };

        socket.onerror = function (error) {
            // setCanSend(false)
            console.error(`[error] ${error.message}`);
        };

        return () => {
            socket.close();
        };
    })

    const submitMessage = (e) => {
        e.preventDefault();
        const messageBox = document.getElementById('groupchat-message');
        const message = document.getElementById('groupchat-message').value;
        messageBox.value = '';


        if (message !== '') {
            try{
                const user = getLocalStorage("user")
                socket.send(JSON.stringify({ message, target: messaging.id }))
                setMessageList([...messageList, { message, username: user.first_name, image: user.image, created_at: new Date() }]);
            }
            catch(error){
                console.error(error)
            }
        }
    };

    return <form
        name="publish"
        className="chat-message-box"
        onSubmit={submitMessage}
    >
        <input
            type="text"
            id="groupchat-message"
            className="chat-message-input-box"
        />
        <button type="submit" className="btn btn-secondary" >
            {/* disabled={!canSend} */}
            {window.t("Send")}
        </button>
    </form>
}