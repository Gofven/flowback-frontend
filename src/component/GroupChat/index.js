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

import React from "react";
import CommentBox from "../FeedCard/AllTab/CommentBox";
import GroupChatRow from "./GroupChatRow";

const data = [
  {
    img: "/img/avtar1.png",
    firstname: "Loke",
    lastname: "Hagberg",
    duration: "15:37",
    message: "Welcome to Flowback!",
  },
];
export default function GroupChat() {
  return (
    <div className="card group-chat-card chat-list-card chat-card card-rounded overflow-hidden">
      <div className="card-header flex-header">
        <h4 className="card-title">Welcome</h4>
        {/*Placeholder for change size button*/}
        {/*<a*/}
        {/*  href="#"*/}
        {/*  className="btn btn-sm btn-outline-secondary radius5 py-0 fw-bolder"*/}
        {/*>*/}
        {/*  change size*/}
        {/*</a>*/}
      </div>
      {/*Placeholder for Group Chat, Groups selection*/}
      {/*<div className="media">*/}
      {/*  <img src="" className="media-img" />*/}
      {/*  <div className="media-body">*/}
      {/*    <p className="text-turncate mb-0">A</p>*/}
      {/*    <p className="text-turncate small">Main chat</p>*/}
      {/*  </div>*/}
      {/*  <div className="down-arro">*/}
      {/*    <img src="/img/avtar-arrow-blue.png" />*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="card-body overflow-hidden">
        <div className="pre-scrollable">
          <div className="chat-view">
            {data?.map((item, index) => (
              <GroupChatRow {...item} key={index} />
            ))}
          </div>
        </div>
      </div>
      {/*Placeholder for comment box? Should be a message box, after all it's a group chat*/}
      {/*<div className="card-footer">*/}
      {/*  <CommentBox />*/}
      {/*</div>*/}
    </div>
  );
}
