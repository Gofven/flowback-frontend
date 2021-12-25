/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import React, { useEffect, useRef, useState } from "react";
import { postRequest } from "../../utils/API";
import { formatDate } from "../../utils/common";
import { getLocalStorage } from "../../utils/localStorage";
import Image from "../common/Image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { Button } from "../common";
import { CHAT, ROOMS } from "../../store/types";
import { connect } from "react-redux";


function ChatPopup({ room, socketRef, opened, setNewMessages, setPreviousMessages, setRoomLastMsg, chatMessages, closeChatPopup, setUnreadMessageCount }) {

  const dummy = useRef();
  // const [lastMessageId, setLastMessageId] = useState();
  const [page, setPage] = useState(1);
  // const [pageSize, setPageSize] = useState(25);
  const [messages, setMessages] = useState([]);
  const [lastMsgId, setLastMsgId] = useState(null);

  useEffect(() => {
    getAllMessageByRoom(5)
  }, [])

  /**
   * To get all messages by room
   * @param {*} pageSize 
   * @param {*} lastMessageId 
   */
  const getAllMessageByRoom = (pageSize, lastMessageId) => {
    const data = {
      last_message_id: lastMessageId,
      page_size: pageSize,
      friend_id: room?.friend_details?.id
    }
    postRequest("api/v1/friend/get_chat_messages", data).then(
      (response) => {
        console.log('response', response);
        const { status, data } = response;
        if (status === "success") {

          if (lastMessageId) {
            // const array = [...data?.data, ...messages];
            // setMessages(array.map((entry) => entry));
            setPreviousMessages(room?.id, data?.data?.message)
              ;
          } else {
            // const array = [...messages, ...data?.data];
            // setMessages(array.map((entry) => entry));
            setNewMessages(room?.id, data?.data?.message);
            setUnreadMessageCount(room?.id, data?.data?.unread_messages)
            // if (setLastMessage) {
            //   setLastMessage(data?.data[data?.data?.length - 1].message);
            // }
          }
        }
      }
    );
  }

  /**
   * To handle text changes and send message if enter is pressed
   * @param {*} e 
   */
  const handleKeypress = (e) => {
    // console.log("ctrl", e.ctrlKey)
    if (e.key === "Enter" && e.shiftKey) {
      // e.target.value = e.target.value + '\n'
    }
    else if (e.key === "Enter") {
      sendMessage(e.target.value);
      e.target.value = null;
    }

  }

  /**
   * To send a message on message button click
   */
  const sendMessageByButton = () => {
    const message = document.getElementById('message').value;
    sendMessage(message);
  }
  const loggedInUser = getLocalStorage('user');
  const sendMessage = (message) => {
    const messageDetails = {
      'logged_in_user_id': loggedInUser?.id,
      'friend_user_id': room?.friend_details?.id,
      'message': message
    }
    console.log("message", messageDetails)
    try {
      socketRef.send(JSON.stringify(messageDetails));
      // getAllMessageByRoom(1);
    }
    catch (err) {
      console.log("Err", err);
    }
  }

  useEffect(() => {
    const msgs = chatMessages[room.id] || [];
    if (msgs.length) {
      const lastMsg = msgs[msgs.length - 1];
      setLastMsgId(lastMsg)
      setRoomLastMsg(room.id, lastMsg.message)
    }
    setMessages([...msgs]);
  }, [chatMessages]);

  useEffect(() => {
    if (messages.length) {
      if (messages[messages.length - 1].id !== lastMsgId) {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
        setLastMsgId(messages[messages.length - 1].id);
      }
    }
  }, [messages]);

  const onCloseChat = () => {
    closeChatPopup(room.id);
  }

  return (
    <div className={`chat-block ${!(opened && opened[room.id]) ? ' d-none ' : ''}`}>
      <div className={`collapse ${(opened && opened[room.id] ? ' show ' : '')}`} id={`_${room.room_name}`}>
        <div className="card chat-list-card chat-card">
          <div
            className="card-header"
            // data-bs-toggle="collapse"
            // data-bs-target={`#_${room.room_name}`}
            // aria-expanded="false"
            onClick={onCloseChat}
          >
            <div className="row mx-auto">
              <div className="col-1 px-0 text-right">
                <span className="active-mark"></span>
              </div>
              <div className="col-11 px-1">
                <p className="mb-0" >{room?.friend_details?.full_name}</p>
                {(opened && opened[room.id]) ? 'opened' : 'closed'}
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="pre-scrollable">
              <div className="chat-view">

                <div onClick={() => getAllMessageByRoom(5, messages[0]?.id)} className="load-more cursor-pointer"> Load More... </div>
                {messages?.map((message, index) => (
                  <div className="msg-list-row row mx-auto" key={message.id}>
                    <div className="col-2 px-0">
                      <Image
                        src={message.sender?.image}
                        className="notification-list-img img-fluid"
                      />
                    </div>
                    <div className="col-10 px-2 notification-list-content">
                      <p className="name text-tuncate mb-0">
                        {message.sender?.first_name} {message.sender?.last_name} <br /> <span>{formatDate(message.created_at, "DD MMM YY, HH:mm")}</span>
                      </p>
                      <div className="lst-msg text-tuncate">
                        {message.message}
                      </div>
                    </div>
                  </div>

                ))
                }
              </div>
              <span ref={dummy}></span>
            </div>
          </div>
          <div className="card-footer p-0">
            <div className="write-cmt mt-2">
              <div className="input-group pl-2 d-flex align-items-center">
                <textarea

                  id="message"
                  type="text"
                  className="form-control message-box"
                  placeholder="Type a message"
                  rows='1
                  '
                  onKeyPress={handleKeypress}
                ></textarea>
                <FontAwesomeIcon className="cursor-pointer mx-2"
                  icon={faPaperPlane} color='' size='lg' onClick={sendMessageByButton} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapDispachToProps = dispatch => {
  return {
    closeChatPopup: (roomId) => dispatch({ type: CHAT.CLOSE_CHAT_POPUP, payload: { roomId } }),
    setNewMessages: (roomId, messages) => dispatch({ type: CHAT.SET_NEW_MESSAGES, payload: { roomId, messages } }),
    setPreviousMessages: (roomId, messages) => dispatch({ type: CHAT.SET_PREVIOUS_MESSAGES, payload: { roomId, messages } }),
    setRoomLastMsg: (roomId, msg) => dispatch({ type: ROOMS.SET_ROOM_LAST_MSG, payload: { roomId, msg } }),
    setUnreadMessageCount: (roomId, messageCount) => dispatch({ type: ROOMS.SET_UNREAD_MSG_COUNT, payload: { roomId, messageCount } })
  };
};

const mapStateToProps = state => {
  return {
    chatMessages: state.chats.messages,
    opened: state.chats.opened
  };
};

export default connect(mapStateToProps, mapDispachToProps)(ChatPopup);

