import { useEffect, useState } from 'react';
import { Image, Modal } from 'react-bootstrap';
import { getRequest, postRequest } from "../../utils/API";
import { inputKeyValue } from "../../utils/common";
const { REACT_APP_PROXY } = process.env;

export default function DirectMessage() {
  const [messageList, setMessageList] = useState([]);
  const [chatList, setChatList] = useState([{ person: "", messageList: [] }]);
  const [searchValue, setSearchValue] = useState("")
  const [peopleList, setPeopleList] = useState([])
  const [messaging, setMessaging] = useState(0)
  const [show, setShow] = useState(false)

  const token = JSON.parse(localStorage.getItem('jwtToken'));

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
        `[message] Data received from server: ${JSON.parse(event.data).message
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

    // getRequest("api/v1/chat/dm/preview").then(res => {
    //   console.log(res)
    // })

    getRequest(`api/v1/chat/dm/${1}`).then(res => {
      console.log(res)
    })


    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    document.getElementById('groupchat-messages').scrollBy(100000, 100000);
  }, [messageList]);

  const submitMessage = (e) => {
    e.preventDefault();
    // socket.send("hii");
    const messageBox = document.getElementById('groupchat-message');
    const message = document.getElementById('groupchat-message').value;
    messageBox.value = '';


    if (message !== '') socket.send(JSON.stringify({ message, target: messaging }))

  };

  const searchList = (value) => {
    const data = {
      search_by: "people",
      search_value: value,
      first_page: true,
      page_size: 20,
      page: 1,
      last_created_at: new Date()
    }

    postRequest("api/v1/user_group/get_search_result", data).then(res => {
      const { status, data } = res;
      if (status === "success") {
        setPeopleList(data?.data)
      }
    })

  }

  const handleOnChange = (e) => {
    setSearchValue({ ...searchValue, ...inputKeyValue(e) });
    searchList(e.target.value)
  };

  return (
    <div className="group-chat">
      You are chatting with:
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
          {window.t("Send")}
        </button>
      </form>

      <div className='search-for-users-btn'>
        <button className='btn btn-secondary' onClick={() => setShow(true)}>Search for users</button>
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header>Search for users</Modal.Header>
        <Modal.Body>
          <input type="text" className='chat-message-input-box' onChange={handleOnChange}></input>

          {peopleList.map(person =>
            <div key={person.id} className="flex">
              <div className="profile-content-view">
                <button className="btn btn-secondary" onClick={() => { setMessaging(person.id); setShow(false) }}> Start Chat </button>
              </div>
              <div className="name-list-search">{person.first_name}
              </div>

            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button className='btn btn-danger' onClick={() => setShow(false)}> Close</button>
        </Modal.Footer>
      </Modal>




    </div>
  );
}
