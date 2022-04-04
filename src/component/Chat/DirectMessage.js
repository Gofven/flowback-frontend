import { useEffect, useState } from 'react';
import { Image, Modal } from 'react-bootstrap';
import { getRequest, postRequest } from "../../utils/API";
import { inputKeyValue } from "../../utils/common";
import ChatScreen from './ChatScreen';

export default function DirectMessage() {
  const [messageList, setMessageList] = useState([]);

  const [searchValue, setSearchValue] = useState("")
  const [peopleList, setPeopleList] = useState([])
  const [messaging, setMessaging] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    document.getElementById('groupchat-messages').scrollBy(100000, 100000);
  }, [messageList]);

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

  const handleSelectPersonToChatWith = (person) => {
    getRequest(`api/v1/chat/dm/${person.id}`).then(res => {
      console.log(res, "REPNOSE")
      setMessaging(person);
      setShow(false)
    })
  }

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

      <ChatScreen messageList={messageList} setMessageList={setMessageList} messaging={messaging} />

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
                <button className="btn btn-secondary" onClick={() => handleSelectPersonToChatWith(person)}> Start Chat </button>
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
