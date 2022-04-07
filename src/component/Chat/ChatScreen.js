import { useEffect, useState } from "react";
import { getLocalStorage } from "../../utils/localStorage";
const { REACT_APP_PROXY } = process.env;

export default function ChatScreen({ messageList, setMessageList, messaging }) {
    const token = JSON.parse(localStorage.getItem('jwtToken'));
    // const [chatList, setChatList] = useState([{ person: "", messageList: [] }]);

    let socket;

    useEffect(() => {
        socket = new WebSocket(
            `wss://${REACT_APP_PROXY.split(':')[1]}/ws/direct_chat/?token=${token}`
        );

        socket.onopen = function (event) {
            console.log('[open] Connection established');
        };

        socket.onmessage = function (event) {
            console.log(
                `[message] Data received from server: ${JSON.parse(event.data).message}`
            );
            const data = JSON.parse(event.data);
            setMessageList([...messageList, data]);
        };

        socket.onclose = function (event) {
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
            console.error(`[error] ${error.message}`);
        };

        // getRequest("api/v1/chat/dm/preview").then(res => {
        //   console.log(res)
        // })

        return () => {
            socket.close();
        };
    })

    const submitMessage = (e) => {
        e.preventDefault();
        // socket.send("hii");
        const messageBox = document.getElementById('groupchat-message');
        const message = document.getElementById('groupchat-message').value;
        messageBox.value = '';


        if (message !== '') {
            const user = getLocalStorage("user")
            setMessageList([...messageList, { message, username: user.username, image: user.image, created_at: new Date() }]);
            socket.send(JSON.stringify({ message, target: messaging.id }))
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
        <button type="submit" className="btn btn-secondary">
            {window.t("Send")}
        </button>
    </form>
}