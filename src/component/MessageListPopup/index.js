/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * Copyright (C) 2021  Astroneatech AB
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

import React, { useEffect, useState } from "react";
import "./message.css";
import MessageListRow from "./MessageListRow";


const totalUnreadMessage = 5;
const totalOnline = 8;
export default function MessageListPopup(props) {
  const [rooms, setRooms] = useState([])
  const [totalFriend, setTotalFriend] = useState(0);
  const [totalUnreadMessage, setTotalUnreadMessage] = useState(0);

  // const lastMessages = (roomId) => {
  //   const data = {
  //     page_size: 1,
  //     friend_id: room?.friend_details?.id
  //   }
  //   postRequest("api/v1/friend/get_chat_messages", data).then(
  //     (response) => {
  //       console.log('response', response);
  //       const { status, data } = response;
  //       if (status === "success") {
  //         props.rooms?.filter(room => room.id.includes(roomId)).map(
  //           setRooms({ ...rooms, lastMessage: data?.data[0]?.message })
  //         )
  //       }
  //     }
  //   );
  // }

  useEffect(() => {
    setRooms(props.rooms);
    setTotalFriend(props.rooms.length)
  }, [props.rooms])

  useEffect(() => {
    let totalCount = 0;
    if (props.unreadMessages) {
      Object.keys(props.unreadMessages).forEach((roomId) => {
        if (props.unreadMessages[roomId]) {
          totalCount++;
        }
      })
    }
    setTotalUnreadMessage(totalCount);
  }, [props.unreadMessages]);

  return(<p></p>) // Placeholder for messages functionality below
  // return (x
  //   <div className="fixed-chat">
  //     <div className="card chat-list-card">
  //       <div
  //         className="card-header"
  //         data-bs-toggle="collapse"
  //         data-bs-target="#collapseExample"
  //         aria-expanded="false"
  //       >
  //         <div className="row mx-auto">
  //           <div className="col-1 px-0">
  //             <div className="notification-view">
  //               <i className="las la-sms"></i>
  //               {
  //                 totalUnreadMessage ?
  //                   <span className="notification-badge">{totalUnreadMessage}</span>
  //                   : null
  //               }
  //             </div>
  //           </div>
  //           <div className="col-9">
  //             <p>Messages</p>
  //           </div>
  //           <div className="col-2 px-0">
  //             <div className="active-col">
  //               {/* <span className="active-mark"></span> */}
  //               {/* <span className="active-count">{totalFriend}</span> */}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="collapse" id="collapseExample">
  //         <div className="card-body">
  //           <div className="pre-scrollable">
  //             <div className="chat-view">
  //               {rooms?.map((room) => (
  //                 <MessageListRow key={room.id} room={room} lastMessage={props.lastMessages ? props.lastMessages[room.id] : ''} />
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //         <div className="card-footer p-0">
  //           <form action="#" className="form msg-form" id="msgForm">
  //             <div className="input-group">
  //               <button
  //                 className="btn btn-outline-secondary"
  //                 type="button"
  //                 id="button-addon2"
  //               >
  //                 <i className="las la-search"></i>
  //               </button>
  //               <input
  //                 type="text"
  //                 className="form-control"
  //                 placeholder="Search"
  //                 aria-label="Recipient's username"
  //                 aria-describedby="button-addon2"
  //               />
  //             </div>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
