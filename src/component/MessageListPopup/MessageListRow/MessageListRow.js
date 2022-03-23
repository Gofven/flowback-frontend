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

import React from "react";
import { Badge } from "react-bootstrap";
import { connect } from "react-redux";
import { CHAT, ROOMS } from "../../../store/types";
import { postRequest } from "../../../utils/API";
import Image from "../../common/Image/Image";

function MessageListRow(props) {
  const room = props.room;

  const openChatPopup = () => {
    props.openChatPopup(room.id);
  }

  /**
   * To mark all unseen messages as seen
   */
  const seenAllMessages = () => {
    postRequest("api/v1/friend/seen_messages", { friend_user_id: room.friend_details.id }).then(
      (response) => {
        console.log('response', response);
        const { status, data } = response;
        if (status === "success") {
          props.unreadMesesageCountReset(room?.id);
        } else {
          // setError();
        }
      }
    );
  }
  const onFriendClick = () => {
    openChatPopup();
    seenAllMessages();


  }

  return (
    <div
      className="msg-list-row row mx-auto"
      // data-bs-toggle="collapse"
      // data-bs-target={`#_${room.room_name}`}
      // aria-expanded="false"
      onClick={onFriendClick}
    >
      <div className="col-2 px-0">
        <Image
          src={room?.friend_details?.image}
          className="notification-list-img img-fluid"
        />
      </div>
      <div className="col-8 px-2 notification-list-content">
        <p className="name text-tuncate mb-0">
          {room?.friend_details?.full_name || "test"}
        </p>
        <div className="lst-msg text-tuncate">{props.lastMessages && props.lastMessages[room.id]}</div>
      </div>
      <div className="col-2 px-0 text-right">
        <Badge variant="success" className="bg-danger text-white">
          {props.unreadMessages && props.unreadMessages[room.id] > 0 && props.unreadMessages[room.id]}
        </Badge>
      </div>
    </div>
  );
}

const mapDispachToProps = dispatch => {
  return {
    openChatPopup: (roomId) => dispatch({ type: CHAT.OPEN_CHAT_POPUP, payload: { roomId } }),
    unreadMesesageCountReset: (roomId) => dispatch({ type: ROOMS.UNREAD_MSG_COUNT_RESET, payload: { roomId } })
  };
};

const mapStateToProps = state => {
  return {
    lastMessages: state.rooms.lastMessages,
    unreadMessages: state.rooms.unreadMessages
  };
};

export default connect(mapStateToProps, mapDispachToProps)(MessageListRow);
